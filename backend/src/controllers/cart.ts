import { Request, Response } from "express";
import { Cart } from "../models/cart.js";
import { Course } from "../models/course.js";
import mongoose from "mongoose";

// ================ Get User Cart ================

export const getCart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;

    let cart = await Cart.findOne({ userId }).populate(
      "courses",
      "courseName price thumbnail instructor category"
    );

    if (!cart) {
      cart = await Cart.create({ userId, courses: [], totalAmount: 0 });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

// ================ Add Course to Cart ================

export const addToCart = async (
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

    // Check if user is already enrolled
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentsEnrolled.includes(uid)) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, courses: [], totalAmount: 0 });
    }

    // Check if course is already in cart
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    if (cart.courses.some((id) => id.equals(courseObjectId))) {
      return res.status(400).json({
        success: false,
        message: "Course is already in cart",
      });
    }

    // Add course to cart
    cart.courses.push(courseObjectId);
    await cart.save();

    // Populate and return updated cart
    cart = await Cart.findById(cart._id).populate(
      "courses",
      "courseName price thumbnail instructor category"
    );

    return res.status(200).json({
      success: true,
      message: "Course added to cart",
      cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add course to cart",
    });
  }
};

// ================ Remove Course from Cart ================

export const removeFromCart = async (
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

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Remove course from cart
    cart.courses = cart.courses.filter(
      (id) => !id.equals(new mongoose.Types.ObjectId(courseId))
    );
    await cart.save();

    // Populate and return updated cart
    cart = await Cart.findById(cart._id).populate(
      "courses",
      "courseName price thumbnail instructor category"
    );

    return res.status(200).json({
      success: true,
      message: "Course removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove course from cart",
    });
  }
};

// ================ Clear Cart ================

export const clearCart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { courses: [], totalAmount: 0 },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};
