import mongoose, { Document } from "mongoose";

// Interface for Payment document
interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  courses: mongoose.Types.ObjectId[];
  amount: number;
  currency: string;
  paymentMethod: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  couponCode?: string;
  discountAmount?: number;
  finalAmount: number;
  paymentDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define mongoose schema for Payment
const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "usd",
      uppercase: true,
    },
    paymentMethod: {
      type: String,
      default: "stripe",
    },
    stripeSessionId: {
      type: String,
      index: true,
    },
    stripePaymentIntentId: {
      type: String,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    couponCode: {
      type: String,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ createdAt: -1 });

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
