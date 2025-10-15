import express from "express";
import { auth, isInstructor, isStudent } from "../middlewares/auth.js";
import {
  createQuiz,
  getQuiz,
  getCourseQuizzes,
  submitQuiz,
  getQuizResults,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quiz.js";

const router = express.Router();

// ================ Quiz Routes ================

// Create quiz (Instructor only)
router.post("/create", auth, isInstructor, createQuiz);

// Get single quiz
router.get("/:quizId", auth, getQuiz);

// Get all quizzes for a course
router.get("/course/:courseId", auth, getCourseQuizzes);

// Submit quiz (Student)
router.post("/submit", auth, isStudent, submitQuiz);

// Get quiz results
router.get("/results/:quizId", auth, getQuizResults);

// Update quiz (Instructor only)
router.put("/:quizId", auth, isInstructor, updateQuiz);

// Delete quiz (Instructor only)
router.delete("/:quizId", auth, isInstructor, deleteQuiz);

export default router;
