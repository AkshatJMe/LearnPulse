import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { discussionEndpoints } from "../services/apis";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

interface Reply {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    accountType: string;
  };
  content: string;
  upvotes: string[];
  createdAt: string;
}

interface Thread {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    accountType: string;
  };
  title: string;
  content: string;
  upvotes: string[];
  replies: Reply[];
  createdAt: string;
}

const CourseDiscussion = () => {
  const { courseId } = useParams();
  // @ts-ignore
  const { user } = useSelector((state) => state.profile);
  const [discussions, setDiscussions] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newThread, setNewThread] = useState({ title: "", content: "" });
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDiscussions();
  }, [courseId]);

  const fetchDiscussions = async () => {
    try {
      const response = await apiConnector({
        method: "GET",
        url: `${discussionEndpoints.GET_COURSE_DISCUSSIONS_API}/${courseId}`
      });
      if (response.data.success) {
        setDiscussions(response.data.discussions);
      }
    } catch (error: any) {
      console.error("Error fetching discussions:", error);
      toast.error("Failed to load discussions");
    } finally {
      setLoading(false);
    }
  };

  const createThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThread.title.trim() || !newThread.content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiConnector({
        method: "POST",
        url: discussionEndpoints.CREATE_THREAD_API,
        bodyData: {
          courseId,
          ...newThread,
        }
      });
      if (response.data.success) {
        toast.success("Discussion created!");
        setDiscussions([response.data.discussion, ...discussions]);
        setNewThread({ title: "", content: "" });
        setShowCreateModal(false);
      }
    } catch (error: any) {
      console.error("Error creating discussion:", error);
      toast.error(error.response?.data?.message || "Failed to create discussion");
    } finally {
      setSubmitting(false);
    }
  };

  const addReply = async (threadId: string) => {
    if (!replyContent[threadId]?.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      const response = await apiConnector({
        method: "POST",
        url: discussionEndpoints.ADD_REPLY_API,
        bodyData: {
          discussionId: threadId,
          content: replyContent[threadId],
        }
      });
      if (response.data.success) {
        toast.success("Reply added!");
        setDiscussions(
          discussions.map((thread) =>
            thread._id === threadId
              ? { ...thread, replies: [...thread.replies, response.data.reply] }
              : thread
          )
        );
        setReplyContent({ ...replyContent, [threadId]: "" });
      }
    } catch (error: any) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply");
    }
  };

  const upvoteThread = async (threadId: string) => {
    try {
      const response = await apiConnector({
        method: "POST",
        url: discussionEndpoints.UPVOTE_THREAD_API,
        bodyData: { discussionId: threadId }
      });
      if (response.data.success) {
        setDiscussions(
          discussions.map((thread) =>
            thread._id === threadId ? response.data.discussion : thread
          )
        );
      }
    } catch (error: any) {
      console.error("Error upvoting:", error);
    }
  };

  const upvoteReply = async (discussionId: string, replyId: string) => {
    try {
      const response = await apiConnector({
        method: "POST",
        url: discussionEndpoints.UPVOTE_REPLY_API,
        bodyData: { discussionId, replyId }
      });
      if (response.data.success) {
        setDiscussions(
          discussions.map((thread) =>
            thread._id === discussionId ? response.data.discussion : thread
          )
        );
      }
    } catch (error: any) {
      console.error("Error upvoting reply:", error);
    }
  };

  const formatTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              💬 Course Discussions
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ask questions and help your classmates
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Discussion
            </span>
          </button>
        </div>

        {/* Create Thread Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Start a New Discussion
              </h2>
              <form onSubmit={createThread} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newThread.title}
                    onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What's your question?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newThread.content}
                    onChange={(e) =>
                      setNewThread({ ...newThread, content: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Provide more details..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:cursor-not-allowed"
                  >
                    {submitting ? "Creating..." : "Create Discussion"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Discussions List */}
        <div className="space-y-6">
          {discussions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No discussions yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Be the first to start a conversation!
              </p>
            </div>
          ) : (
            discussions.map((thread) => (
              <div
                key={thread._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Thread Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {thread.userId.firstName[0]}
                        {thread.userId.lastName[0]}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {thread.userId.firstName} {thread.userId.lastName}
                        </span>
                        {thread.userId.accountType === "instructor" && (
                          <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold px-2 py-1 rounded">
                            Instructor
                          </span>
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          · {formatTimeAgo(thread.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {thread.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {thread.content}
                      </p>
                      <div className="flex items-center gap-4 mt-4">
                        <button
                          onClick={() => upvoteThread(thread._id)}
                          className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                            thread.upvotes.includes(user?._id)
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          }`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill={thread.upvotes.includes(user?._id) ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                          {thread.upvotes.length}
                        </button>
                        <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          {thread.replies.length} {thread.replies.length === 1 ? "reply" : "replies"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {thread.replies.length > 0 && (
                  <div className="p-6 bg-gray-50 dark:bg-gray-700/30 space-y-4">
                    {thread.replies.map((reply) => (
                      <div key={reply._id} className="flex items-start gap-3 pl-4 border-l-2 border-blue-500">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {reply.userId.firstName[0]}
                          {reply.userId.lastName[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">
                              {reply.userId.firstName} {reply.userId.lastName}
                            </span>
                            {reply.userId.accountType === "instructor" && (
                              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold px-2 py-0.5 rounded">
                                Instructor
                              </span>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTimeAgo(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 whitespace-pre-wrap">
                            {reply.content}
                          </p>
                          <button
                            onClick={() => upvoteReply(thread._id, reply._id)}
                            className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                              reply.upvotes.includes(user?._id)
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            }`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill={reply.upvotes.includes(user?._id) ? "currentColor" : "none"}
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                            {reply.upvotes.length}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-3">
                    <textarea
                      value={replyContent[thread._id] || ""}
                      onChange={(e) =>
                        setReplyContent({ ...replyContent, [thread._id]: e.target.value })
                      }
                      rows={2}
                      placeholder="Write a reply..."
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <button
                      onClick={() => addReply(thread._id)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 rounded-xl shadow-md hover:shadow-lg transition-all h-fit"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDiscussion;
