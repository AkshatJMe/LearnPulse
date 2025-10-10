import mongoose, { Document } from "mongoose";

// Interface for Discussion document
interface IDiscussion extends Document {
  courseId: mongoose.Types.ObjectId;
  sectionId?: mongoose.Types.ObjectId;
  subSectionId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  parentId?: mongoose.Types.ObjectId; // For replies
  isInstructorReply: boolean;
  isPinned: boolean;
  likes: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Define mongoose schema for Discussion
const discussionSchema = new mongoose.Schema(
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
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discussion",
      default: null,
    },
    isInstructorReply: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Index for efficient querying
discussionSchema.index({ subSectionId: 1, parentId: 1 });
discussionSchema.index({ courseId: 1, createdAt: -1 });

export const Discussion = mongoose.model<IDiscussion>(
  "Discussion",
  discussionSchema
);
