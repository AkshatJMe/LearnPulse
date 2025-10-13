import express from "express";
import { auth, isInstructor } from "../middlewares/auth.js";
import {
  getInstructorAnalytics,
  getCourseStatistics,
} from "../controllers/analytics.js";

const router = express.Router();

// ================ Analytics Routes ================

// Get instructor analytics
router.get("/instructor", auth, isInstructor, getInstructorAnalytics);

// Get specific course statistics
router.get("/course/:courseId", auth, isInstructor, getCourseStatistics);

export default router;
