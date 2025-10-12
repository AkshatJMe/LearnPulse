import mongoose, { Document } from "mongoose";

// Define interface for RatingAndReview document
interface RatingAndReviewDocument extends Document {
  user: mongoose.Types.ObjectId; // ObjectId referencing User document
  rating: number; // Rating value as a number
  review: string; // Review text
  course: mongoose.Types.ObjectId; // ObjectId referencing Course document
}

// Define mongoose schema for RatingAndReview
const ratingAndReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Field type: ObjectId
      ref: "User", // Reference to User model
      required: true, // Field is required
      index: true,
    },
    rating: {
      type: Number, // Changed to Number for proper rating calculation
      required: true, // Field is required
      min: 1,
      max: 5,
    },
    review: {
      type: String, // Field type: String
      required: true, // Field is required
      trim: true,
      maxlength: 1000,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId, // Field type: ObjectId
      required: true, // Field is required
      ref: "Course", // Reference to Course model
      index: true, // Create index on course field for efficient querying
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate reviews by same user
ratingAndReviewSchema.index({ user: 1, course: 1 }, { unique: true });

// Define and export RatingAndReview model
export const RatingAndReview = mongoose.model<RatingAndReviewDocument>(
  "RatingAndReview",
  ratingAndReviewSchema
);
