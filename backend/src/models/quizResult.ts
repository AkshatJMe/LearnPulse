import mongoose, { Document } from "mongoose";

// Interface for QuizResult document
interface IQuizResult extends Document {
  userId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  answers: {
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
  score: number;
  percentage: number;
  passed: boolean;
  attemptNumber: number;
  timeTaken?: number; // Time taken in seconds
  submittedAt: Date;
  createdAt?: Date;
}

// Define mongoose schema for QuizResult
const quizResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    answers: [
      {
        questionIndex: {
          type: Number,
          required: true,
        },
        selectedAnswer: {
          type: Number,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    percentage: {
      type: Number,
      required: true,
      default: 0,
    },
    passed: {
      type: Boolean,
      required: true,
      default: false,
    },
    attemptNumber: {
      type: Number,
      required: true,
      default: 1,
    },
    timeTaken: {
      type: Number, // In seconds
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index for user and quiz
quizResultSchema.index({ userId: 1, quizId: 1 });

export const QuizResult = mongoose.model<IQuizResult>(
  "QuizResult",
  quizResultSchema
);
