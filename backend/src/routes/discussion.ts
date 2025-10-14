import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  createDiscussion,
  getDiscussions,
  getReplies,
  toggleLike,
  togglePin,
  updateDiscussion,
  deleteDiscussion,
} from "../controllers/discussion.js";

const router = express.Router();

// ================ Discussion Routes ================

// Create discussion/question or reply
router.post("/create", auth, createDiscussion);

// Get discussions for subsection or course
router.get("/", auth, getDiscussions);

// Get replies for a discussion
router.get("/:discussionId/replies", auth, getReplies);

// Like/unlike discussion
router.post("/:discussionId/like", auth, toggleLike);

// Pin/unpin discussion (Instructor)
router.post("/:discussionId/pin", auth, togglePin);

// Update discussion
router.put("/:discussionId", auth, updateDiscussion);

// Delete discussion
router.delete("/:discussionId", auth, deleteDiscussion);

export default router;
