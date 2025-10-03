import { Request, Response } from "express";
import { Course } from "../models/course.js";
import { User } from "../models/user.js";
import { Payment } from "../models/payment.js";
import mongoose from "mongoose";

// ================ Get Instructor Analytics ================

export const getInstructorAnalytics = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const instructorId = req.user?.id;

    // Get all courses by instructor
    const courses = await Course.find({ instructor: instructorId });
    const courseIds = courses.map((course) => course._id);

    // Total students enrolled across all courses
    const totalStudents = courses.reduce(
      (sum, course) => sum + course.studentsEnrolled.length,
      0
    );

    // Total revenue
    const instructor = await User.findById(instructorId);
    const totalRevenue = instructor?.totalRevenue || 0;

    // Revenue per course
    const revenuePerCourse = courses.map((course) => ({
      courseName: course.courseName,
      revenue: course.totalRevenue || 0,
      studentsEnrolled: course.studentsEnrolled.length,
      averageRating: course.averageRating || 0,
      totalRatings: course.totalRatings || 0,
    }));

    // Monthly earnings (last 12 months)
    const monthlyEarnings = await Payment.aggregate([
      {
        $match: {
          status: "completed",
          courses: { $in: courseIds },
          paymentDate: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
          },
        },
      },
      {
        $unwind: "$courses",
      },
      {
        $match: {
          courses: { $in: courseIds },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courses",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      {
        $unwind: "$courseDetails",
      },
      {
        $group: {
          _id: {
            year: { $year: "$paymentDate" },
            month: { $month: "$paymentDate" },
          },
          revenue: { $sum: "$courseDetails.price" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Course completion rate (simplified)
    // In a real scenario, you'd calculate based on CourseProgress
    const completionRates = courses.map((course) => ({
      courseName: course.courseName,
      studentsEnrolled: course.studentsEnrolled.length,
      // This would need actual completion data from CourseProgress
      completionRate: 0, // Placeholder
    }));

    // Top performing courses
    const topCourses = [...courses]
      .sort((a, b) => {
        const aScore = (a.totalRevenue || 0) + a.studentsEnrolled.length * 10;
        const bScore = (b.totalRevenue || 0) + b.studentsEnrolled.length * 10;
        return bScore - aScore;
      })
      .slice(0, 5)
      .map((course) => ({
        courseName: course.courseName,
        revenue: course.totalRevenue || 0,
        studentsEnrolled: course.studentsEnrolled.length,
        averageRating: course.averageRating || 0,
      }));

    return res.status(200).json({
      success: true,
      analytics: {
        overview: {
          totalCourses: courses.length,
          totalStudents,
          totalRevenue,
          averageRating:
            courses.reduce((sum, c) => sum + (c.averageRating || 0), 0) /
              courses.length || 0,
        },
        revenuePerCourse,
        monthlyEarnings,
        completionRates,
        topCourses,
      },
    });
  } catch (error) {
    console.error("Error fetching instructor analytics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

// ================ Get Course Statistics ================

export const getCourseStatistics = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { courseId } = req.params;
    const instructorId = req.user?.id;

    // Verify course belongs to instructor
    const course = await Course.findOne({
      _id: courseId,
      instructor: instructorId,
    })
      .populate("studentsEnrolled", "firstName lastName email")
      .populate("ratingAndReviews");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or unauthorized",
      });
    }

    // Get enrollment trend (last 30 days)
    const enrollmentTrend = await Payment.aggregate([
      {
        $match: {
          status: "completed",
          courses: new mongoose.Types.ObjectId(courseId),
          paymentDate: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$paymentDate" },
            month: { $month: "$paymentDate" },
            day: { $dayOfMonth: "$paymentDate" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      statistics: {
        courseName: course.courseName,
        studentsEnrolled: course.studentsEnrolled.length,
        revenue: course.totalRevenue || 0,
        averageRating: course.averageRating || 0,
        totalRatings: course.totalRatings || 0,
        enrollmentTrend,
      },
    });
  } catch (error) {
    console.error("Error fetching course statistics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course statistics",
    });
  }
};
