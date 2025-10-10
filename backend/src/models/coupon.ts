import mongoose, { Document } from "mongoose";

// Interface for Coupon document
interface ICoupon extends Document {
  code: string;
  discountPercent: number;
  discountAmount?: number;
  discountType: "percent" | "fixed";
  expiryDate?: Date;
  maxUsage?: number;
  usedCount: number;
  courseId?: mongoose.Types.ObjectId; // If specific to a course
  isActive: boolean;
  minPurchaseAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please enter the Coupon Code"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountPercent: {
      type: Number,
      min: 0,
      max: 100,
    },
    discountAmount: {
      type: Number,
      min: 0,
    },
    discountType: {
      type: String,
      enum: ["percent", "fixed"],
      default: "percent",
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    maxUsage: {
      type: Number,
      default: null, // Null means unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null, // Null means applicable to all courses
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    minPurchaseAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Method to check if coupon is valid
couponSchema.methods.isValid = function () {
  if (!this.isActive) return false;
  if (this.expiryDate && this.expiryDate < new Date()) return false;
  if (this.maxUsage && this.usedCount >= this.maxUsage) return false;
  return true;
};

export const Coupon = mongoose.model<ICoupon>("Coupon", couponSchema);
