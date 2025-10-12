import mongoose, { Document } from "mongoose";

// Interface for Wishlist document
interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  courses: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Define mongoose schema for Wishlist
const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model<IWishlist>("Wishlist", wishlistSchema);
