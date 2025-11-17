import { useEffect, useState } from "react";
import { apiConnector } from "../../services/apiConnector";
import { courseEndpoints, adminEndPoints } from "../../services/apis";
import { toast } from "react-hot-toast";

interface Course {
  _id: string;
  courseName: string;
  courseDescription: string;
  thumbnail: string;
  instructor: {
    firstName: string;
    lastName: string;
    email: string;
  };
  price: number;
  status: string;
  createdAt: string;
}

const ContentModeration = () => {
  const [pendingCourses, setPendingCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  const fetchPendingCourses = async () => {
    try {
      const response = await apiConnector({
        method: "GET",
        url: courseEndpoints.GET_ALL_COURSE_API
      });
      if (response.data.success) {
        // Filter for pending/unapproved courses
        const pending = response.data.data.filter(
          (course: Course) => course.status === "Draft" || course.status === "Pending"
        );
        setPendingCourses(pending);
      }
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load pending courses");
    } finally {
      setLoading(false);
    }
  };

  const approveCourse = async (courseId: string) => {
    setProcessingId(courseId);
    try {
      const response = await apiConnector({
        method: "PUT",
        url: `${adminEndPoints.APPROVE_COURSE_API}/${courseId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        toast.success("Course approved successfully!");
        setPendingCourses(pendingCourses.filter((c) => c._id !== courseId));
      }
    } catch (error: any) {
      console.error("Error approving course:", error);
      toast.error(error.response?.data?.message || "Failed to approve course");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectClick = (course: Course) => {
    setSelectedCourse(course);
    setShowRejectModal(true);
  };

  const rejectCourse = async () => {
    if (!selectedCourse || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setProcessingId(selectedCourse._id);
    try {
      const response = await apiConnector({
        method: "PUT",
        url: `${adminEndPoints.REJECT_COURSE_API}/${selectedCourse._id}`,
        bodyData: { rejectionReason },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        toast.success("Course rejected");
        setPendingCourses(pendingCourses.filter((c) => c._id !== selectedCourse._id));
        setShowRejectModal(false);
        setRejectionReason("");
        setSelectedCourse(null);
      }
    } catch (error: any) {
      console.error("Error rejecting course:", error);
      toast.error(error.response?.data?.message || "Failed to reject course");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-orange-50 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-900/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🛡️ Content Moderation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and approve pending courses - {pendingCourses.length} pending
          </p>
        </div>

        {/* Reject Modal */}
        {showRejectModal && selectedCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Reject Course: {selectedCourse.courseName}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Please provide a detailed reason for rejection. This will be sent to the instructor.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
                placeholder="E.g., Content quality needs improvement, missing required sections, inappropriate material..."
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                    setSelectedCourse(null);
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={rejectCourse}
                  disabled={processingId === selectedCourse._id}
                  className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:cursor-not-allowed"
                >
                  {processingId === selectedCourse._id
                    ? "Rejecting..."
                    : "Reject Course"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Courses List */}
        {pendingCourses.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              All caught up!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              No courses pending review at this time
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Course Thumbnail */}
                  <div className="lg:w-80 h-48 lg:h-auto flex-shrink-0 relative">
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {course.status}
                      </span>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                          {course.courseName}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                          {course.courseDescription}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <svg
                              className="w-5 h-5 text-gray-500 dark:text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">
                              Instructor:{" "}
                              <strong>
                                {course.instructor.firstName} {course.instructor.lastName}
                              </strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg
                              className="w-5 h-5 text-gray-500 dark:text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">
                              {course.instructor.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg
                              className="w-5 h-5 text-gray-500 dark:text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">
                              Price: <strong className="text-green-600 dark:text-green-400">${course.price}</strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg
                              className="w-5 h-5 text-gray-500 dark:text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">
                              Submitted:{" "}
                              {new Date(course.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <button
                          onClick={() => approveCourse(course._id)}
                          disabled={processingId === course._id}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
                        >
                          {processingId === course._id ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                              Processing...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Approve Course
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => handleRejectClick(course)}
                          disabled={processingId === course._id}
                          className="flex-1 bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 font-semibold py-3 px-6 rounded-xl border-2 border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Reject Course
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentModeration;
