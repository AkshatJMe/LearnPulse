import crypto from "crypto";
import { Request, Response } from "express";
import mongoose from "mongoose";

// Import Razorpay configuration (ensure this is configured properly)
import { instance } from "../config/razorpay.js";
import { Course } from "../models/course.js";
import { CourseProgress } from "../models/courseProgress.js";
import { mailSender } from "../utils/mailSender.js";
import { courseEnrollmentEmail } from "../mail/templates/courseEnrollmentEmail.js";
import { User } from "../models/user.js";
import { Cart } from "../models/cart.js";
import { Certificate } from "../models/certificate.js";

// ================ Capture the payment and initiate the 'Razorpay order' ================

/**
 * Handles capturing the payment by creating a Razorpay order.
 * @param req - The HTTP request object containing the course IDs.
 * @param res - The HTTP response object used to send back the result.
 * @returns A JSON response indicating success or failure.
 */
export const capturePayment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // Extract course IDs from the request body
  const { coursesId }: { coursesId: string[] } = req.body;
  // Extract the user ID from the request object (assumed to be set by authentication middleware)
  const userId = req.user?.id;

  // Validate that course IDs are provided
  if (coursesId.length === 0) {
    return res.json({ success: false, message: "Please provide Course Id" });
  }

  let totalAmount = 0;

  // Iterate over each course ID to validate and calculate the total amount
  for (const course_id of coursesId) {
    let course;
    try {
      // Fetch course details from the database
      course = await Course.findById(course_id);
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: "Could not find the course" });
      }

      // Check if the user is already enrolled in the course
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res
          .status(400)
          .json({ success: false, message: "Student is already Enrolled" });
      }

      // Accumulate the total amount to be charged
      totalAmount += course.price!;
    } catch (error) {
      // Log the error and return a server error response
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "error is capturing payment" });
    }
  }

  // Set up Razorpay order options
  const currency = "INR";
  const options = {
    amount: totalAmount * 100, // Amount in paise
    currency,
    receipt: (Math.random() * Date.now()).toString(), // Unique receipt ID
  };

  // Attempt to create a Razorpay order
  try {
    const paymentResponse = await instance.orders.create(options);
    // Return the payment response on success
    return res.status(200).json({
      success: true,
      message: paymentResponse,
    });
  } catch (error) {
    // Log the error and return a failure response
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Could not initiate order" });
  }
};

// ================ Verify the payment ================

/**
 * Verifies the payment by checking the signature and enrolling the student.
 * @param req - The HTTP request object containing payment details and courses.
 * @param res - The HTTP response object used to send back the result.
 * @returns A JSON response indicating the verification result.
 */
export const verifyPayment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    coursesId,
    userId,
  }: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    coursesId?: string[];
    userId?: string;
  } = req.body;

  // Validate required fields
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !coursesId ||
    !userId
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Payment failed, data not found" });
  }

  // Create the string to be hashed for verification
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  // Generate the expected signature using the Razorpay secret key
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET!)
    .update(body)
    .digest("hex");

  // Check if the generated signature matches the received signature
  if (expectedSignature === razorpay_signature) {
    // If the signature matches, enroll the student in the courses
    await enrollStudents(coursesId, userId, res);
    return res.status(200).json({ success: true, message: "Payment verified" });
  }
  // If the signature does not match, return a failure response
  return res.status(200).json({ success: false, message: "Payment failed" });
};

// ================ Enroll Students in courses after payment ================

/**
 * Enrolls students in courses after successful payment and sets up their progress.
 * @param courses - Array of course IDs to enroll the student in.
 * @param userId - The ID of the user to enroll.
 * @param res - The HTTP response object used to send back the result.
 */
const enrollStudents = async (
  courses: string[],
  userId: string,
  res: Response
) => {
  // Validate that courses and user ID are provided
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide data for courses or userId",
    });
  }

  // Iterate over each course ID to enroll the student
  for (const courseId of courses) {
    try {
      // Find the course and add the user to the enrolled students list
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $addToSet: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, message: "Course not found" });
      }

      // Initialize course progress with 0 percent completion
      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      // Update the user's document with the new course and progress information
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            courses: courseId,
          },
          $push: {
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      // Send an email notification to the student about the successful enrollment
      await mailSender(
        enrolledStudent!.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent!.firstName}`
        )
      );

      // Auto-generate certificate record at purchase time (idempotent)
      const instructor = await User.findById(enrolledCourse.instructor).select(
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
            studentName: `${enrolledStudent!.firstName} ${enrolledStudent!.lastName}`,
            courseName: enrolledCourse.courseName,
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
    } catch (error) {
      // Log the error and send a server error response
      console.log(error);
      res.status(500).json({ success: false, message: "Some error occured" });
      return;
    }
  }

  // Remove purchased courses from user's cart
  try {
    const purchasedCourseObjectIds = courses
      .map((courseId) => new mongoose.Types.ObjectId(courseId))
      .filter(Boolean);

    if (purchasedCourseObjectIds.length > 0) {
      await Cart.findOneAndUpdate(
        { userId },
        { $pull: { courses: { $in: purchasedCourseObjectIds } } }
      );
    }
  } catch (error) {
    console.log("Error while clearing purchased courses from cart", error);
  }
};

// ================ Send payment success email ================

/**
 * Sends a confirmation email to the user after a successful payment.
 * @param req - The HTTP request object containing payment details.
 * @param res - The HTTP response object used to send back the result.
 * @returns A JSON response indicating the success or failure of the email sending.
 */
export const sendPaymentSuccessEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // Extract details from the request body
  const {
    orderId,
    paymentId,
    amount,
  }: { orderId?: string; paymentId?: string; amount?: number } = req.body;
  const userId = req.user?.id;

  // Validate that all required fields are present
  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the fields" });
  }

  try {
    // Fetch the user's details from the database
    const enrolledStudent = await User.findById(userId);
    // Send a payment success email
    // await mailSender(
    //   enrolledStudent!.email,
    //   `Payment Received`,
    //   paymentSuccessEmail(
    //     `${enrolledStudent!.firstName}`,
    //     amount / 100,
    //     orderId,
    //     paymentId
    //   )
    // );
    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    // Log the error and return a failure response
    console.log("Error in sending mail", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not send email" });
  }
};
