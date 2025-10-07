import { Request, Response } from "express";
import { Wishlist } from "../models/wishlist.js";
import { Course } from "../models/course.js";
import mongoose from "mongoose";

// ================ Get User Wishlist ================

export const getWishlist = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;

    let wishlist = await Wishlist.findOne({ userId }).populate(
      "courses",
      "courseName price thumbnail instructor category averageRating"
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, courses: [] });
    }

    return res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
};

// ================ Add Course to Wishlist ================

export const addToWishlist = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, courses: [] });
    }

    // Check if course is already in wishlist
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    if (wishlist.courses.some((id) => id.equals(courseObjectId))) {
      return res.status(400).json({
        success: false,
        message: "Course is already in wishlist",
      });
    }

    // Add course to wishlist
    wishlist.courses.push(courseObjectId);
    await wishlist.save();

    // Populate and return updated wishlist
    wishlist = await Wishlist.findById(wishlist._id).populate(
      "courses",
      "courseName price thumbnail instructor category averageRating"
    );

    return res.status(200).json({
      success: true,
      message: "Course added to wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add course to wishlist",
    });
  }
};

// ================ Remove Course from Wishlist ================

export const removeFromWishlist = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    // Remove course from wishlist
    wishlist.courses = wishlist.courses.filter(
      (id) => !id.equals(new mongoose.Types.ObjectId(courseId))
    );
    await wishlist.save();

    // Populate and return updated wishlist
    wishlist = await Wishlist.findById(wishlist._id).populate(
      "courses",
      "courseName price thumbnail instructor category averageRating"
    );

    return res.status(200).json({
      success: true,
      message: "Course removed from wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove course from wishlist",
    });
  }
};

// ================ Toggle Wishlist ================

export const toggleWishlist = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, courses: [] });
    }

    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const index = wishlist.courses.findIndex((id) => id.equals(courseObjectId));

    let message;
    if (index > -1) {
      // Remove from wishlist
      wishlist.courses.splice(index, 1);
      message = "Course removed from wishlist";
    } else {
      // Add to wishlist
      wishlist.courses.push(courseObjectId);
      message = "Course added to wishlist";
    }

    await wishlist.save();

    // Populate and return updated wishlist
    wishlist = await Wishlist.findById(wishlist._id).populate(
      "courses",
      "courseName price thumbnail instructor category averageRating"
    );

    return res.status(200).json({
      success: true,
      message,
      wishlist,
    });
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update wishlist",
    });
  }
};
