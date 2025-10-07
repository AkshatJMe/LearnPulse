import { Request, Response } from "express";
import mongoose from "mongoose";
import Stripe from "stripe";
import { stripe } from "../config/stripe.js";
import { Course } from "../models/course.js";
import { CourseProgress } from "../models/courseProgress.js";
import { User } from "../models/user.js";
import { Payment } from "../models/payment.js";
import { Coupon } from "../models/coupon.js";
import { Cart } from "../models/cart.js";
import { Certificate } from "../models/certificate.js";
import { mailSender } from "../utils/mailSender.js";
import { courseEnrollmentEmail } from "../mail/templates/courseEnrollmentEmail.js";
import { paymentSuccessEmail } from "../mail/templates/paymentSuccessEmail.js";
import crypto from "crypto";

const isMockPayments = process.env.PAYMENTS_MOCK === "true";
const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:5173";

// ================ Create Stripe Checkout Session ================

/**
 * Creates a Stripe checkout session for course purchase
 * @param req - The HTTP request object containing course IDs and optional coupon
 * @param res - The HTTP response object
 * @returns A JSON response with the checkout session URL
 */
export const createCheckoutSession = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { couponCode }: { couponCode?: string } = req.body;
    const coursesId: string[] = req.body.coursesId || req.body.courseIds;
    const userId = req.user?.id;

    if (!coursesId || coursesId.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide course IDs" 
      });
    }

    // Fetch course details
    const courses = await Course.find({ _id: { $in: coursesId } });
    
    if (courses.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No courses found" 
      });
    }

    // Check if user is already enrolled in any course
    const uid = new mongoose.Types.ObjectId(userId);
    for (const course of courses) {
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(400).json({
          success: false,
          message: `You are already enrolled in ${course.courseName}`,
        });
      }
    }

    // Calculate total amount
    let totalAmount = courses.reduce((sum, course) => sum + (course.price || 0), 0);
    let discountAmount = 0;
    let validCoupon = null;

    // Apply coupon if provided
    if (couponCode) {
      validCoupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      
      if (validCoupon && (validCoupon as any).isValid()) {
        // Check if coupon is course-specific
        if (validCoupon.courseId) {
          const courseInCart = courses.find(c => c._id.equals(validCoupon!.courseId!));
          if (!courseInCart) {
            return res.status(400).json({
              success: false,
              message: "This coupon is not applicable to the selected courses",
            });
          }
        }

        // Check minimum purchase amount
        if (validCoupon.minPurchaseAmount && totalAmount < validCoupon.minPurchaseAmount) {
          return res.status(400).json({
            success: false,
            message: `Minimum purchase amount of $${validCoupon.minPurchaseAmount} required`,
          });
        }

        // Calculate discount
        if (validCoupon.discountType === "percent") {
          discountAmount = (totalAmount * (validCoupon.discountPercent || 0)) / 100;
        } else {
          discountAmount = validCoupon.discountAmount || 0;
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired coupon code",
        });
      }
    }

    const finalAmount = Math.max(totalAmount - discountAmount, 0);

    // Create line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = courses.map(course => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: course.courseName,
          description: course.courseDescription?.substring(0, 200) || "",
          images: course.thumbnail ? [course.thumbnail] : undefined,
        },
        unit_amount: Math.round((course.price || 0) * 100), // Convert to cents
      },
      quantity: 1,
    }));

    // Add discount as a negative line item if applicable
    if (discountAmount > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `Discount (${couponCode})`,
            description: "Coupon discount applied",
            images: undefined,
          },
          unit_amount: -Math.round(discountAmount * 100),
        },
        quantity: 1,
      });
    }

    // Create payment record
    const payment = await Payment.create({
      userId,
      courses: coursesId,
      amount: totalAmount,
      currency: "USD",
      couponCode: validCoupon?.code,
      discountAmount,
      finalAmount,
      status: "pending",
    });

    if (isMockPayments) {
      const mockSessionId = `mock_session_${payment._id.toString()}`;
      payment.stripeSessionId = mockSessionId;
      await payment.save();

      const sessionUrl = `${frontendBaseUrl}/payment-success?session_id=${mockSessionId}`;
      return res.status(200).json({
        success: true,
        sessionId: mockSessionId,
        sessionUrl,
        url: sessionUrl,
        mock: true,
        message: "Mock checkout session created successfully",
      });
    }

    if (!stripe) {
      return res.status(503).json({
        success: false,
        message:
          "Stripe is not configured. Set STRIPE_SECRET_KEY or enable PAYMENTS_MOCK=true for local testing.",
      });
    }

    // TypeScript assertion: stripe is guaranteed to be non-null after above check
    const stripeInstance = stripe as Stripe;

    // Create Stripe checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: lineItems,
      mode: "payment",
      success_url: `${frontendBaseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendBaseUrl}/payment-cancel`,
      metadata: {
        userId: userId || "",
        coursesId: JSON.stringify(coursesId),
        paymentId: payment._id.toString(),
        couponCode: (validCoupon?.code || "") as string,
      },
    };

    // Add client_reference_id only if userId exists
    if (userId) {
      sessionParams.client_reference_id = userId;
    }

    const session = await stripeInstance.checkout.sessions.create(sessionParams);

    // Update payment with session ID
    payment.stripeSessionId = session.id;
    await payment.save();

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      sessionUrl: session.url,
      url: session.url,
      message: "Checkout session created successfully",
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
    });
  }
};

// ================ Stripe Webhook Handler ================

/**
 * Handles Stripe webhook events for payment confirmation
 * @param req - The HTTP request object
 * @param res - The HTTP response object
 */
export const stripeWebhook = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (isMockPayments) {
    return res.status(200).json({
      success: true,
      mock: true,
      message: "Webhook ignored in mock payment mode",
    });
  }

  if (!stripe) {
    return res.status(503).json({
      success: false,
      message: "Stripe is not configured",
    });
  }

  const sig = req.headers["stripe-signature"] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as any;
      await handleSuccessfulPayment(session);
      break;

    case "checkout.session.async_payment_succeeded":
      const asyncSession = event.data.object as any;
      await handleSuccessfulPayment(asyncSession);
      break;

    case "checkout.session.async_payment_failed":
      const failedSession = event.data.object as any;
      await handleFailedPayment(failedSession);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.json({ received: true });
};

// ================ Handle Successful Payment ================

/**
 * Enrolls students and updates records after successful payment
 * @param session - The Stripe session object
 */
const handleSuccessfulPayment = async (session: any) => {
  try {
    const { userId, coursesId, paymentId, couponCode } = session.metadata;
    const courses = JSON.parse(coursesId);

    const normalizeCourseId = (courseRef: any) => {
      if (!courseRef) return null;
      if (typeof courseRef === "string") return courseRef;
      if (typeof courseRef === "object" && courseRef._id) {
        return String(courseRef._id);
      }
      return String(courseRef);
    };

    // Update payment status
    const payment = await Payment.findById(paymentId);
    if (payment) {
      payment.status = "completed";
      payment.stripePaymentIntentId = session.payment_intent;
      payment.paymentDate = new Date();
      await payment.save();
    }

    // Increment coupon usage if applicable
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode },
        { $inc: { usedCount: 1 } }
      );
    }

    // Enroll student in courses
    for (const rawCourseId of courses) {
      const courseId = normalizeCourseId(rawCourseId);
      if (!courseId) continue;

      const course = await Course.findById(courseId);
      if (!course) continue;

      // Add student to course (atomic, no duplicates)
      await Course.findByIdAndUpdate(courseId, {
        $addToSet: { studentsEnrolled: new mongoose.Types.ObjectId(userId) },
        $inc: { totalRevenue: course.price || 0 },
      });

      // Create course progress
      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      // Update user (atomic, no duplicates)
      await User.findByIdAndUpdate(userId, {
        $addToSet: { courses: new mongoose.Types.ObjectId(courseId) },
        $push: { courseProgress: courseProgress._id as mongoose.Types.ObjectId },
      });

      const user = await User.findById(userId);
      if (user) {
        // Send enrollment email
        await mailSender(
          user.email,
          `Successfully Enrolled in ${course.courseName}`,
          courseEnrollmentEmail(course.courseName, user.firstName)
        );

        // Auto-generate certificate record at purchase time (idempotent)
        const instructor = await User.findById(course.instructor).select(
          "firstName lastName"
        );

        await Certificate.findOneAndUpdate(
          {
            userId: new mongoose.Types.ObjectId(userId),
            courseId: new mongoose.Types.ObjectId(courseId),
          },
          {
            $setOnInsert: {
              certificateId: `CERT-${crypto.randomBytes(8)
                .toString("hex")
                .toUpperCase()}`,
              studentName: `${user.firstName} ${user.lastName}`,
              courseName: course.courseName,
              instructorName: instructor
                ? `${instructor.firstName} ${instructor.lastName}`
                : "Instructor",
              completionDate: new Date(),
              issueDate: new Date(),
              isValid: true,
            },
          },
          { upsert: true, new: true }
        );
      }

      // Update instructor revenue
      const instructor = await User.findById(course.instructor);
      if (instructor) {
        instructor.totalRevenue = (instructor.totalRevenue || 0) + (course.price || 0);
        await instructor.save();
      }
    }

    // Remove purchased courses from user's cart
    const purchasedCourseObjectIds = courses
      .map((courseRef: any) => {
        if (!courseRef) return null;
        if (typeof courseRef === "string") return new mongoose.Types.ObjectId(courseRef);
        if (typeof courseRef === "object" && courseRef._id) {
          return new mongoose.Types.ObjectId(String(courseRef._id));
        }
        return new mongoose.Types.ObjectId(String(courseRef));
      })
      .filter(Boolean);

    if (purchasedCourseObjectIds.length > 0) {
      await Cart.findOneAndUpdate(
        { userId },
        { $pull: { courses: { $in: purchasedCourseObjectIds } } }
      );
    }

    // Send payment success email
    const user = await User.findById(userId);
    if (user) {
      await mailSender(
        user.email,
        "Payment Successful",
        paymentSuccessEmail(
          user.firstName,
          payment?.finalAmount || 0,
          payment?._id.toString() || "",
          session.payment_intent
        )
      );
    }
  } catch (error) {
    console.error("Error handling successful payment:", error);
  }
};

// ================ Handle Failed Payment ================

/**
 * Updates payment status when payment fails
 * @param session - The Stripe session object
 */
const handleFailedPayment = async (session: any) => {
  try {
    const { paymentId } = session.metadata;

    // Update payment status
    await Payment.findByIdAndUpdate(paymentId, {
      status: "failed",
    });
  } catch (error) {
    console.error("Error handling failed payment:", error);
  }
};

// ================ Verify Payment Status ================

/**
 * Verifies payment status for a session
 * @param req - The HTTP request object
 * @param res - The HTTP response object
 */
export const verifyPayment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { sessionId } = req.body;
    const userId = req.user?.id;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    if (isMockPayments) {
      const payment = await Payment.findOne({
        stripeSessionId: sessionId,
        userId,
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment session not found",
        });
      }

      if (payment.status !== "completed") {
        await handleSuccessfulPayment({
          metadata: {
            userId,
            coursesId: JSON.stringify(payment.courses),
            paymentId: payment._id.toString(),
            couponCode: payment.couponCode || "",
          },
          payment_intent: `mock_intent_${payment._id.toString()}`,
        });
      }

      const updatedPayment = await Payment.findById(payment._id)
        .populate("courses", "courseName thumbnail")
        .lean();

      return res.status(200).json({
        success: true,
        paymentStatus: "paid",
        payment: {
          courses: updatedPayment?.courses || [],
          amount: updatedPayment?.finalAmount || 0,
          createdAt: updatedPayment?.createdAt,
        },
        message: "Mock payment verified successfully",
      });
    }

    if (!stripe) {
      return res.status(503).json({
        success: false,
        message:
          "Stripe is not configured. Set STRIPE_SECRET_KEY or enable PAYMENTS_MOCK=true for local testing.",
      });
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.client_reference_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Get payment record
    const payment = await Payment.findOne({ stripeSessionId: sessionId })
      .populate("courses", "courseName thumbnail")
      .lean();

    return res.status(200).json({
      success: true,
      paymentStatus: session.payment_status,
      payment: {
        courses: payment?.courses || [],
        amount: payment?.finalAmount || 0,
        createdAt: payment?.createdAt,
      },
      message: "Payment status retrieved successfully",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
};

// ================ Get Payment History ================

/**
 * Gets payment history for a user
 * @param req - The HTTP request object
 * @param res - The HTTP response object
 */
export const getPaymentHistory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;

    const payments = await Payment.find({ userId })
      .populate("courses", "courseName thumbnail price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
    });
  }
};
