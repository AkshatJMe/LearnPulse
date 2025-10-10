import mongoose, { Document } from "mongoose";

// Interface for Certificate document
interface ICertificate extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  certificateId: string; // Unique certificate identifier
  studentName: string;
  courseName: string;
  instructorName: string;
  completionDate: Date;
  issueDate: Date;
  certificateUrl?: string; // URL to certificate PDF/image
  isValid: boolean;
  createdAt?: Date;
}

// Define mongoose schema for Certificate
const certificateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    instructorName: {
      type: String,
      required: true,
    },
    completionDate: {
      type: Date,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    certificateUrl: {
      type: String,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate certificates
certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Certificate = mongoose.model<ICertificate>(
  "Certificate",
  certificateSchema
);
