import { Request, Response } from "express";
import { User } from "../models/user.js";
import { Course } from "../models/course.js";
import { Payment } from "../models/payment.js";
import { RatingAndReview } from "../models/ratingAndreview.js";
import { Section } from "../models/section.js";
import { SubSection } from "../models/subSection.js";
import { mailSender } from "../utils/mailSender.js";
import { deleteResourceFromCloudinary } from "../utils/imageUploader.js";
import { courseApprovalEmail } from "../mail/templates/courseApprovalEmail.js";
import { courseRejectionEmail } from "../mail/templates/courseRejectionEmail.js";

// ================ Get Platform Analytics ================

export const getPlatformAnalytics = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Total users by role
    const totalStudents = await User.countDocuments({ accountType: "student" });
    const totalInstructors = await User.countDocuments({ accountType: "instructor" });
    const totalUsers = totalStudents + totalInstructors;

    // Total courses
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ status: "Published" });
    const pendingCourses = await Course.countDocuments({ status: "Pending" });

    // Revenue analytics (robust against missing paymentDate/finalAmount)
    const completedPayments = await Payment.find({ status: "completed" })
      .select("finalAmount amount paymentDate createdAt courses")
      .lean();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const getAmount = (payment: any) =>
      Number(payment?.finalAmount ?? payment?.amount ?? 0);
    const getDate = (payment: any) =>
      new Date(payment?.paymentDate ?? payment?.createdAt ?? now);

    const totalRevenue = completedPayments.reduce(
      (sum: number, payment: any) => sum + getAmount(payment),
      0
    );

    const monthlyRevenueNumber = completedPayments.reduce(
      (sum: number, payment: any) => {
        const paymentDate = getDate(payment);
        return paymentDate >= startOfMonth ? sum + getAmount(payment) : sum;
      },
      0
    );

    const dailyRevenueNumber = completedPayments.reduce(
      (sum: number, payment: any) => {
        const paymentDate = getDate(payment);
        return paymentDate >= startOfDay ? sum + getAmount(payment) : sum;
      },
      0
    );

    // Build monthly trend (last 12 months)
    const monthlyMap = new Map<string, { revenue: number; count: number }>();
    for (const payment of completedPayments) {
      const paymentDate = getDate(payment);
      if (paymentDate < new Date(new Date().setMonth(new Date().getMonth() - 12))) {
        continue;
      }
      const key = `${paymentDate.getFullYear()}-${paymentDate.getMonth() + 1}`;
      const prev = monthlyMap.get(key) || { revenue: 0, count: 0 };
      prev.revenue += getAmount(payment);
      prev.count += 1;
      monthlyMap.set(key, prev);
    }

    const monthlyRevenue = Array.from(monthlyMap.entries())
      .map(([key, value]) => {
        const [year, month] = key.split("-").map(Number);
        return {
          _id: { year, month },
          revenue: value.revenue,
          count: value.count,
        };
      })
      .sort(
        (a, b) =>
          a._id.year - b._id.year || a._id.month - b._id.month
      );

    // Build daily trend (last 30 days)
    const dailyMap = new Map<string, { revenue: number; count: number }>();
    for (const payment of completedPayments) {
      const paymentDate = getDate(payment);
      if (paymentDate < new Date(new Date().setDate(new Date().getDate() - 30))) {
        continue;
      }
      const key = `${paymentDate.getFullYear()}-${paymentDate.getMonth() + 1}-${paymentDate.getDate()}`;
      const prev = dailyMap.get(key) || { revenue: 0, count: 0 };
      prev.revenue += getAmount(payment);
      prev.count += 1;
      dailyMap.set(key, prev);
    }

    const dailyRevenue = Array.from(dailyMap.entries())
      .map(([key, value]) => {
        const [year, month, day] = key.split("-").map(Number);
        return {
          _id: { year, month, day },
          revenue: value.revenue,
          count: value.count,
        };
      })
      .sort(
        (a, b) =>
          a._id.year - b._id.year ||
          a._id.month - b._id.month ||
          a._id.day - b._id.day
      );

    // Top courses by revenue from completed payments
    const courseRevenueMap = new Map<string, { enrollments: number; revenue: number }>();
    for (const payment of completedPayments) {
      const courses = Array.isArray((payment as any).courses) ? (payment as any).courses : [];
      const amount = getAmount(payment);
      const perCourseAmount = courses.length > 0 ? amount / courses.length : 0;

      for (const courseIdRaw of courses) {
        const courseId = String(courseIdRaw);
        const prev = courseRevenueMap.get(courseId) || { enrollments: 0, revenue: 0 };
        prev.enrollments += 1;
        prev.revenue += perCourseAmount;
        courseRevenueMap.set(courseId, prev);
      }
    }

    const topCourseIds = Array.from(courseRevenueMap.entries())
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 10)
      .map(([courseId]) => courseId);

    const topCourseDocs = await Course.find({ _id: { $in: topCourseIds } })
      .select("courseName studentsEnrolled thumbnail")
      .lean();

    const topCourses = topCourseIds
      .map((courseId) => {
        const courseDoc = topCourseDocs.find((course: any) => String(course._id) === courseId);
        if (!courseDoc) return null;
        const stats = courseRevenueMap.get(courseId)!;
        return {
          _id: courseDoc._id,
          courseName: courseDoc.courseName,
          studentsEnrolled: Array.isArray(courseDoc.studentsEnrolled)
            ? courseDoc.studentsEnrolled.length
            : stats.enrollments,
          totalRevenue: stats.revenue,
          thumbnail: courseDoc.thumbnail,
        };
      })
      .filter(Boolean);

    // Active instructors (instructors with at least one published course)
    const activeInstructors = await Course.distinct("instructor", {
      status: "Published",
    });

    return res.status(200).json({
      success: true,
      analytics: {
        users: {
          total: totalUsers,
          students: totalStudents,
          instructors: totalInstructors,
          activeInstructors: activeInstructors.length,
        },
        courses: {
          total: totalCourses,
          published: publishedCourses,
          pending: pendingCourses,
        },
        revenue: {
          total: totalRevenue,
          monthlyCurrent: monthlyRevenueNumber,
          dailyCurrent: dailyRevenueNumber,
          monthly: monthlyRevenue,
          daily: dailyRevenue,
        },
        topCourses,
      },
    });
  } catch (error) {
    console.error("Error fetching platform analytics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

// ================ Approve Course ================

export const approveCourse = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("instructor", "firstName lastName email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    course.status = "Published";
    course.isApproved = true;
    course.rejectionReason = undefined;
    await course.save();

    // Send approval email to instructor
    const instructor = course.instructor as any;
    await mailSender(
      instructor.email,
      "Course Approved!",
      courseApprovalEmail(
        `${instructor.firstName} ${instructor.lastName}`,
        course.courseName
      )
    );

    return res.status(200).json({
      success: true,
      message: "Course approved successfully",
      course,
    });
  } catch (error) {
    console.error("Error approving course:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to approve course",
    });
  }
};

// ================ Reject Course ================

export const rejectCourse = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { courseId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const course = await Course.findById(courseId).populate("instructor", "firstName lastName email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    course.status = "Rejected";
    course.isApproved = false;
    course.rejectionReason = reason;
    await course.save();

    // Send rejection email to instructor
    const instructor = course.instructor as any;
    await mailSender(
      instructor.email,
      "Course Requires Revision",
      courseRejectionEmail(
        `${instructor.firstName} ${instructor.lastName}`,
        course.courseName,
        reason
      )
    );

    return res.status(200).json({
      success: true,
      message: "Course rejected successfully",
      course,
    });
  } catch (error) {
    console.error("Error rejecting course:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reject course",
    });
  }
};

// ================ Disable Course ================

export const disableCourse = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByIdAndUpdate(
      courseId,
      { status: "Draft", isApproved: false },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course disabled successfully",
      course,
    });
  } catch (error) {
    console.error("Error disabling course:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to disable course",
    });
  }
};

// ================ Remove Review ================

export const removeReview = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { reviewId } = req.params;

    const review = await RatingAndReview.findByIdAndUpdate(
      reviewId,
      { isRemoved: true, isApproved: false },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Update course average rating
    await updateCourseRating(review.course.toString());

    return res.status(200).json({
      success: true,
      message: "Review removed successfully",
    });
  } catch (error) {
    console.error("Error removing review:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove review",
    });
  }
};

// ================ Get Pending Courses ================

export const getPendingCourses = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const courses = await Course.find({ status: "Pending" })
      .populate("instructor", "firstName lastName email")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Error fetching pending courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending courses",
    });
  }
};

// ================ Get All Users ================

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { role, page = 1, limit = 20 } = req.query;

    const filter: any = {};
    if (role) {
      filter.accountType = role;
    }

    const users = await User.find(filter)
      .select("-password -token")
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// ================ Toggle User Active Status ================

export const toggleUserStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.active = !user.active;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${user.active ? "activated" : "deactivated"} successfully`,
      user: {
        id: user._id,
        active: user.active,
      },
    });
  } catch (error) {
    console.error("Error toggling user status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
};

// ================ Admin Delete User (Ban) ================

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Find the user to delete
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deletion of admin users
    if (user.accountType === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete admin users",
      });
    }

    // Delete user's enrolled courses association
    if (user.courses && user.courses.length > 0) {
      await Course.updateMany(
        { studentsEnrolled: userId },
        { $pull: { studentsEnrolled: userId } }
      );
    }

    // Delete user from database
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting user",
    });
  }
};

// ================ Admin Delete Course ================

export const adminDeleteCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    // Find the course to delete
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete the course's thumbnail image from Cloudinary
    await deleteResourceFromCloudinary(course?.thumbnail);

    // Delete sections and sub-sections related to the course
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Find the section and delete its sub-sections
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection; //@ts-ignore
        for (const subSectionId of subSections) {
          const subSection = await SubSection.findById(subSectionId);
          if (subSection) {
            // Delete video associated with the sub-section from Cloudinary
            await deleteResourceFromCloudinary(subSection.videoUrl);
          }
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }
      await Section.findByIdAndDelete(sectionId);
    }

    // Finally, delete the course itself
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: course,
    });
  } catch (error) {
    console.error("Admin Delete Course Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting course",
    });
  }
};

// ================ Helper Function: Update Course Rating ===========================

async function updateCourseRating(courseId: string) {
  try {
    const reviews = await RatingAndReview.find({
      course: courseId,
      isApproved: true,
      isRemoved: false,
    });

    if (reviews.length === 0) {
      await Course.findByIdAndUpdate(courseId, {
        averageRating: 0,
        totalRatings: 0,
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
    const averageRating = totalRating / reviews.length;

    await Course.findByIdAndUpdate(courseId, {
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalRatings: reviews.length,
    });
  } catch (error) {
    console.error("Error updating course rating:", error);
  }
}
