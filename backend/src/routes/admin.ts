import express from "express";
import { auth, isAdmin } from "../middlewares/auth.js";
import {
  getPlatformAnalytics,
  approveCourse,
  rejectCourse,
  disableCourse,
  removeReview,
  getPendingCourses,
  getAllUsers,
  toggleUserStatus,
  adminDeleteCourse,
  deleteUser,
} from "../controllers/admin.js";

const router = express.Router();

// ================ Admin Routes ================

// Get platform analytics
router.get("/analytics", auth, isAdmin, getPlatformAnalytics);

// Get pending courses
router.get("/courses/pending", auth, isAdmin, getPendingCourses);

// Approve course
router.put("/courses/approve/:courseId", auth, isAdmin, approveCourse);

// Reject course
router.put("/courses/reject/:courseId", auth, isAdmin, rejectCourse);

// Disable course
router.put("/courses/disable/:courseId", auth, isAdmin, disableCourse);

// Remove review
router.delete("/reviews/:reviewId", auth, isAdmin, removeReview);

// Get all users
router.get("/users", auth, isAdmin, getAllUsers);

// Toggle user active status
router.put("/users/:userId/toggle-status", auth, isAdmin, toggleUserStatus);

// Delete course (admin only)
router.delete("/courses/:courseId", auth, isAdmin, adminDeleteCourse);

// Delete user (ban user)
router.delete("/users/:userId", auth, isAdmin, deleteUser);

export default router;
