import mongoose, { Document } from "mongoose";

// Interface for Quiz document
interface IQuiz extends Document {
  courseId: mongoose.Types.ObjectId;
  sectionId?: mongoose.Types.ObjectId;
  subSectionId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  questions: {
    questionText: string;
    options: string[];
    correctAnswer: number; // Index of correct answer
    points: number;
  }[];
  totalPoints: number;
  passingScore: number;
  duration?: number; // Duration in minutes
  attemptLimit?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define mongoose schema for Quiz
const quizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
    subSectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    questions: [
      {
        questionText: {
          type: String,
          required: true,
        },
        options: {
          type: [String],
          required: true,
          validate: {
            validator: function (v: string[]) {
              return v.length >= 2 && v.length <= 6;
            },
            message: "Quiz must have between 2 and 6 options",
          },
        },
        correctAnswer: {
          type: Number,
          required: true,
          min: 0,
        },
        points: {
          type: Number,
          default: 1,
          min: 0,
        },
      },
    ],
    totalPoints: {
      type: Number,
      required: true,
      default: 0,
    },
    passingScore: {
      type: Number,
      required: true,
      default: 60, // 60% passing score
    },
    duration: {
      type: Number, // Duration in minutes
      default: 30,
    },
    attemptLimit: {
      type: Number,
      default: 3, // Max 3 attempts by default
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Calculate total points before saving
quizSchema.pre("save", function (next) {
  if (this.questions && this.questions.length > 0) {
    this.totalPoints = this.questions.reduce(
      (sum, question) => sum + question.points,
      0
    );
  }
  next();
});

export const Quiz = mongoose.model<IQuiz>("Quiz", quizSchema);
