import { Request, Response } from "express";
import { Discussion } from "../models/discussion.js";
import { User } from "../models/user.js";

// ================ Create Discussion/Question ================

export const createDiscussion = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    const { courseId, sectionId, subSectionId, content, parentId } = req.body;

    if (!courseId || !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide course ID and content",
      });
    }

    // Check if user is instructor
    const user = await User.findById(userId);
    const isInstructorReply = user?.accountType === "instructor";

    const discussion = await Discussion.create({
      courseId,
      sectionId,
      subSectionId,
      userId,
      content,
      parentId: parentId || null,
      isInstructorReply,
    });

    const populatedDiscussion = await Discussion.findById(discussion._id)
      .populate("userId", "firstName lastName image accountType")
      .populate("parentId");

    return res.status(201).json({
      success: true,
      message: "Discussion created successfully",
      discussion: populatedDiscussion,
    });
  } catch (error) {
    console.error("Error creating discussion:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create discussion",
    });
  }
};

// ================ Get Discussions for SubSection ================

export const getDiscussions = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { subSectionId, courseId } = req.query;

    const filter: any = {};
    if (subSectionId) {
      filter.subSectionId = subSectionId;
      filter.parentId = null; // Only get parent discussions, not replies
    } else if (courseId) {
      filter.courseId = courseId;
      filter.parentId = null;
    } else {
      return res.status(400).json({
        success: false,
        message: "Please provide subSectionId or courseId",
      });
    }

    const discussions = await Discussion.find(filter)
      .populate("userId", "firstName lastName image accountType")
      .sort({ isPinned: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      discussions,
    });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch discussions",
    });
  }
};

// ================ Get Replies for Discussion ================

export const getReplies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { discussionId } = req.params;

    const replies = await Discussion.find({ parentId: discussionId })
      .populate("userId", "firstName lastName image accountType")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      replies,
    });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch replies",
    });
  }
};

// ================ Like/Unlike Discussion ================

export const toggleLike = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    const { discussionId } = req.params;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    const userObjectId = discussion.likes.find((id) =>
      id.equals(userId as any)
    );
    const hasLiked = !!userObjectId;

    if (hasLiked) {
      // Unlike
      discussion.likes = discussion.likes.filter(
        (id) => !id.equals(userId as any)
      );
    } else {
      // Like
      discussion.likes.push(userId as any);
    }

    await discussion.save();

    return res.status(200).json({
      success: true,
      message: hasLiked ? "Like removed" : "Discussion liked",
      likesCount: discussion.likes.length,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update like",
    });
  }
};

// ================ Pin/Unpin Discussion (Instructor) ================

export const togglePin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { discussionId } = req.params;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    discussion.isPinned = !discussion.isPinned;
    await discussion.save();

    return res.status(200).json({
      success: true,
      message: discussion.isPinned ? "Discussion pinned" : "Discussion unpinned",
      discussion,
    });
  } catch (error) {
    console.error("Error toggling pin:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update pin status",
    });
  }
};

// ================ Update Discussion ================

export const updateDiscussion = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    const { discussionId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const discussion = await Discussion.findOne({
      _id: discussionId,
      userId,
    });

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found or unauthorized",
      });
    }

    discussion.content = content;
    await discussion.save();

    return res.status(200).json({
      success: true,
      message: "Discussion updated successfully",
      discussion,
    });
  } catch (error) {
    console.error("Error updating discussion:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update discussion",
    });
  }
};

// ================ Delete Discussion ================

export const deleteDiscussion = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    const { discussionId } = req.params;

    const discussion = await Discussion.findOne({
      _id: discussionId,
      userId,
    });

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found or unauthorized",
      });
    }

    // Delete all replies as well
    await Discussion.deleteMany({ parentId: discussionId });
    await discussion.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Discussion deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting discussion:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete discussion",
    });
  }
};
