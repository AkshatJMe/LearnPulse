import mongoose, { Document } from "mongoose";

// Interface for the Mongoose Document (instance)
interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: "admin" | "instructor" | "student";
  active: boolean;
  approved: boolean;
  additionalDetails: mongoose.Types.ObjectId; // Reference to Profile document
  courses?: mongoose.Types.ObjectId[]; // Array of references to Course documents
  image: string;
  token?: string; // Optional token
  resetPasswordTokenExpires?: Date; // Optional date for reset password token expiration
  courseProgress?: mongoose.Types.ObjectId[]; // Array of references to CourseProgress documents
  wishlist?: mongoose.Types.ObjectId; // Reference to Wishlist document
  cart?: mongoose.Types.ObjectId; // Reference to Cart document
  totalRevenue?: number; // Total revenue for instructors
  createdAt?: Date; // Automatically managed by Mongoose timestamps
  updatedAt?: Date; // Automatically managed by Mongoose timestamps
}
// Define the Mongoose Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["admin", "instructor", "student"],
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    approved: {
      type: Boolean,
      default: true,
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    courses: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
      ],
      default: [],
    },
    image: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    resetPasswordTokenExpires: {
      type: Date,
    },
    courseProgress: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CourseProgress",
        },
      ],
      default: [],
    },
    wishlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wishlist",
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Define and export the User model
export const User = mongoose.model<IUser>("User", userSchema);
