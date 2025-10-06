import { Request, Response } from "express";
import { Quiz } from "../models/quiz.js";
import { QuizResult } from "../models/quizResult.js";
import mongoose from "mongoose";

// ================ Create Quiz (Instructor) ================

export const createQuiz = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      courseId,
      sectionId,
      subSectionId,
      title,
      description,
      questions,
      passingScore,
      duration,
      attemptLimit,
    } = req.body;

    if (!courseId || !title || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const quiz = await Quiz.create({
      courseId,
      sectionId,
      subSectionId,
      title,
      description,
      questions,
      passingScore: passingScore || 60,
      duration: duration || 30,
      attemptLimit: attemptLimit || 3,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create quiz",
    });
  }
};

// ================ Get Quiz by ID ================

export const getQuiz = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId).populate("courseId", "courseName");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Remove correct answers for students
    const sanitizedQuiz = quiz.toObject();
    sanitizedQuiz.questions = sanitizedQuiz.questions.map((q: any) => ({
      questionText: q.questionText,
      options: q.options,
      points: q.points,
      // Don't include correctAnswer for students
    })) as any;

    return res.status(200).json({
      success: true,
      quiz: sanitizedQuiz,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz",
    });
  }
};

// ================ Get Course Quizzes ================

export const getCourseQuizzes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { courseId } = req.params;

    const quizzes = await Quiz.find({ courseId, isActive: true });

    return res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes",
    });
  }
};

// ================ Submit Quiz ================

export const submitQuiz = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    const { quizId, answers, timeTaken } = req.body;

    if (!quizId || !answers) {
      return res.status(400).json({
        success: false,
        message: "Please provide quiz ID and answers",
      });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check attempt limit
    const previousAttempts = await QuizResult.countDocuments({ userId, quizId });
    if (quiz.attemptLimit && previousAttempts >= quiz.attemptLimit) {
      return res.status(400).json({
        success: false,
        message: "Maximum attempt limit reached",
      });
    }

    // Calculate score
    let score = 0;
    const processedAnswers = answers.map((answer: any, index: number) => {
      const question = quiz.questions[answer.questionIndex];
      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) {
        score += question.points;
      }
      return {
        questionIndex: answer.questionIndex,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
      };
    });

    const percentage = (score / quiz.totalPoints) * 100;
    const passed = percentage >= quiz.passingScore;

    // Save quiz result
    const quizResult = await QuizResult.create({
      userId,
      quizId,
      courseId: quiz.courseId,
      answers: processedAnswers,
      score,
      percentage: parseFloat(percentage.toFixed(2)),
      passed,
      attemptNumber: previousAttempts + 1,
      timeTaken,
    });

    return res.status(200).json({
      success: true,
      message: passed ? "Congratulations! You passed!" : "You didn't pass. Try again!",
      result: {
        score,
        totalPoints: quiz.totalPoints,
        percentage,
        passed,
        attemptNumber: quizResult.attemptNumber,
      },
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
    });
  }
};

// ================ Get Quiz Results ================

export const getQuizResults = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    const { quizId } = req.params;

    const results = await QuizResult.find({ userId, quizId })
      .sort({ createdAt: -1 })
      .populate("quizId", "title totalPoints passingScore");

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz results",
    });
  }
};

// ================ Update Quiz (Instructor) ================

export const updateQuiz = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { quizId } = req.params;
    const updateData = req.body;

    const quiz = await Quiz.findByIdAndUpdate(quizId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      quiz,
    });
  } catch (error) {
    console.error("Error updating quiz:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update quiz",
    });
  }
};

// ================ Delete Quiz (Instructor) ================

export const deleteQuiz = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findByIdAndDelete(quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Delete all quiz results
    await QuizResult.deleteMany({ quizId });

    return res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete quiz",
    });
  }
};
