import mongoose, { Schema, Document } from "mongoose";

// Define interface for Course document (optional but recommended)
interface ICourse extends Document {
  courseName: string;
  courseDescription?: string;
  instructor: mongoose.Types.ObjectId; // Reference to User document (assuming IUser interface exists)
  whatYouWillLearn?: string;
  courseContent: mongoose.Types.ObjectId[]; // Array of Section references (assuming ISection interface exists)
  ratingAndReviews: mongoose.Types.ObjectId[]; // Array of RatingAndReview references (assuming IRatingAndReview interface exists)
  price?: number;
  thumbnail?: string;
  category?: mongoose.Types.ObjectId; // Reference to Category document (assuming ICategory interface exists)
  tag: string[];
  studentsEnrolled: mongoose.Types.ObjectId[]; // Array of User references (assuming IUser interface exists)
  instructions?: string[];
  status?: "Draft" | "Published" | "Pending" | "Rejected"; // Status enum
  averageRating?: number;
  totalRatings?: number;
  isApproved?: boolean;
  rejectionReason?: string;
  totalRevenue?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define mongoose schema
const courseSchema: Schema = new Schema({
  courseName: {
    type: String,
    required: true, // Course name is required
  },
  courseDescription: {
    type: String,
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true, // Instructor is required
  },
  whatYouWillLearn: {
    type: String,
  },
  courseContent: [
    {
      type: Schema.Types.ObjectId,
      ref: "Section", // Array of references to Section model
    },
  ],
  ratingAndReviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "RatingAndReview", // Array of references to RatingAndReview model
    },
  ],
  price: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category", // Reference to Category model
  },
  tag: {
    type: [String],
    required: true, // At least one tag is required
  },
  studentsEnrolled: [
    {
      type: Schema.Types.ObjectId,
      ref: "User", // Array of references to User model
      required: true, // At least one student must be enrolled
    },
  ],
  instructions: {
    type: [String],
  },
  status: {
    type: String,
    enum: ["Draft", "Published", "Pending", "Rejected"], // Added Pending and Rejected for admin moderation
    default: "Draft",
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  rejectionReason: {
    type: String,
  },
  totalRevenue: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Default value is current timestamp
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Default value is current timestamp
  },
});

// Define and export mongoose model
export const Course = mongoose.model<ICourse>("Course", courseSchema);
