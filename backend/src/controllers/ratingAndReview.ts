import { Request, Response } from "express";
import { Course } from "../models/course.js";
import { RatingAndReview } from "../models/ratingAndreview.js";
import mongoose from "mongoose";

// Handler to create a new rating and review for a course
export const createRating = async (req: Request, res: Response) => {
  try {
    // Extract rating, review, and courseId from request body
    const { rating, review, courseId } = req.body;

    // Extract userId from the request object
    const userId = req.user?.id;

    // Validate that all required fields are present
    if (!rating || !review || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if the user is enrolled in the course
    const course = await Course.findOne({
      _id: courseId,
      studentsEnrolled: userId,
    });

    // Respond with an error if the course does not exist or the user is not enrolled
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "You must be enrolled in the course to review it",
      });
    }

    // Check if the user has already reviewed this course
    const alreadyReviewed = await RatingAndReview.findOne({
      course: courseId,
      user: userId,
    });

    // Respond with an error if the user has already reviewed the course
    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "You have already reviewed this course",
      });
    }

    // Create a new rating and review entry in the database
    const ratingReview = await RatingAndReview.create({
      user: userId,
      course: courseId,
      rating: Number(rating),
      review,
      isApproved: true,
    });

    // Link the new rating and review to the course
    await Course.findByIdAndUpdate(courseId, {
      $push: {
        ratingAndReviews: ratingReview._id,
      },
    });

    // Update course average rating
    await updateCourseAverageRating(courseId);

    // Populate user details before sending response
    const populatedReview = await RatingAndReview.findById(ratingReview._id)
      .populate("user", "firstName lastName image");

    // Respond with success and the newly created rating and review
    return res.status(201).json({
      success: true,
      data: populatedReview,
      message: "Rating and review created successfully",
    });
  } catch (error) {
    console.error("Error creating rating:", error);
    // Handle any errors that occur during the creation process
    return res.status(500).json({
      success: false,
      message: "Error while creating rating and review",
    });
  }
};

// Helper function to update course average rating
async function updateCourseAverageRating(courseId: string) {
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
    console.error("Error updating average rating:", error);
  }
}

// Handler to get the average rating for a course
export const getAverageRating = async (req: Request, res: Response) => {
  try {
    // Extract course ID from request body
    const courseId = req.body.courseId;

    // Calculate the average rating using aggregation
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    // Respond with the average rating if available
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    // If no ratings exist, respond with a message indicating no ratings have been given
    return res.status(200).json({
      success: true,
      message: "Average Rating is 0, no ratings given till now",
      averageRating: 0,
    });
  } catch (error) {
    // Handle any errors that occur during the aggregation process
    return res.status(500).json({
      success: false,
      message: "Error while calculating average rating", // Corrected typo from "No reviews founnd" to "Error while calculating average rating"
    });
  }
};

// Handler to get all ratings and reviews for courses
export const getAllRatingReview = async (req: Request, res: Response) => {
  try {
    // Fetch all ratings and reviews, sorting by rating in descending order and populating user and course details
    const allReviews = await RatingAndReview.find({
      isApproved: true,
      isRemoved: false,
    })
      .sort({ rating: "desc", createdAt: -1 })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName thumbnail",
      })
      .exec();

    // Respond with all fetched reviews
    return res.status(200).json({
      success: true,
      data: allReviews,
      message: "All reviews fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    // Handle any errors that occur during the fetch process
    return res.status(500).json({
      success: false,
      message: "Error while fetching reviews",
    });
  }
};

// Handler to get course reviews
export const getCourseReviews = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    const reviews = await RatingAndReview.find({
      course: courseId,
      isApproved: true,
      isRemoved: false,
    })
      .populate("user", "firstName lastName image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching course reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching course reviews",
    });
  }
};

// Handler to update a review
export const updateReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { reviewId } = req.params;
    const { rating, review } = req.body;

    const existingReview = await RatingAndReview.findOne({
      _id: reviewId,
      user: userId,
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found or unauthorized",
      });
    }

    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }
      existingReview.rating = Number(rating);
    }

    if (review) {
      existingReview.review = review;
    }

    await existingReview.save();

    // Update course average rating
    await updateCourseAverageRating(existingReview.course.toString());

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: existingReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating review",
    });
  }
};

// Handler to delete a review
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { reviewId } = req.params;

    const review = await RatingAndReview.findOne({
      _id: reviewId,
      user: userId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or unauthorized",
      });
    }

    const courseId = review.course.toString();

    await review.deleteOne();

    // Remove from course
    await Course.findByIdAndUpdate(courseId, {
      $pull: { ratingAndReviews: reviewId },
    });

    // Update course average rating
    await updateCourseAverageRating(courseId);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting review",
    });
  }
};
