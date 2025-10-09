import mongoose, { Document } from "mongoose";

// Interface for Cart document
interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  courses: mongoose.Types.ObjectId[];
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define mongoose schema for Cart
const cartSchema = new mongoose.Schema(
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
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Calculate total amount before saving
cartSchema.pre("save", async function (next) {
  if (this.courses && this.courses.length > 0) {
    const Course = mongoose.model("Course");
    const courses = await Course.find({ _id: { $in: this.courses } });
    this.totalAmount = courses.reduce(
      (sum, course: any) => sum + (course.price || 0),
      0
    );
  } else {
    this.totalAmount = 0;
  }
  next();
});

export const Cart = mongoose.model<ICart>("Cart", cartSchema);
