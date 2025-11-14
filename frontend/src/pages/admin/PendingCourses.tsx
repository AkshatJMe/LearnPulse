import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  getPendingCourses,
  approveCourse,
  rejectCourse,
} from "../../services/operations/adminAPI";

interface PendingCourse {
  _id: string;
  courseName: string;
  courseDescription: string;
  instructor: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  category: {
    name: string;
  };
  price: number;
  thumbnail: string;
  createdAt: string;
}

const PendingCourses: React.FC = () => {
  const { token } = useSelector((state: any) => state.auth);
  const [courses, setCourses] = useState<PendingCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  const fetchPendingCourses = async () => {
    try {
      setLoading(true);
      const data = await getPendingCourses(token);
      setCourses(data);
    } catch (error) {
      console.error("Error fetching pending courses:", error);
      toast.error("Failed to fetch pending courses");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCourse = async (courseId: string) => {
    try {
      setProcessingId(courseId);
      await approveCourse(courseId, token);
      toast.success("Course approved successfully!");
      fetchPendingCourses();
    } catch (error) {
      console.error("Error approving course:", error);
      toast.error("Failed to approve course");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectCourse = async (courseId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      setRejectingId(courseId);
      await rejectCourse(courseId, rejectionReason, token);
      toast.success("Course rejected successfully!");  
      setRejectionReason("");
      setRejectingId(null);
      fetchPendingCourses();
    } catch (error) {
      console.error("Error rejecting course:", error);
      toast.error("Failed to reject course");
    } finally {
      setRejectingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-2">Pending Course Approvals</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Review and approve/reject submitted courses</p>

      {courses.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg border border-gray-300 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No pending courses for review</p>
        </div>
      ) : (
        <div className="space-y-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden hover:border-gray-400 dark:hover:border-gray-600 transition"
            >
              <div className="flex flex-col md:flex-row gap-6 p-6">
                {/* Course Thumbnail */}
                <div className="md:w-48 md:h-32 flex-shrink-0">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Course Details */}
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold mb-2">{course.courseName}</h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {course.courseDescription}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-500">Instructor</p>
                      <p className="font-semibold">
                        {course.instructor.firstName} {course.instructor.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{course.instructor.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-500">Category</p>
                      <p className="font-semibold">{course.category.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-500">Price</p>
                      <p className="font-semibold text-green-600 dark:text-green-400">₹{course.price}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-500">Submitted</p>
                      <p className="font-semibold">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Rejection Reason Input */}
                  {rejectingId === course._id && (
                    <div className="mb-4">
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter rejection reason to send to instructor..."
                        className="w-full p-3 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-wrap">
                    {rejectingId === course._id ? (
                      <>
                        <button
                          onClick={() => handleRejectCourse(course._id)}
                          disabled={!rejectionReason.trim()}
                          className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded font-semibold transition"
                        >
                          Confirm Rejection
                        </button>
                        <button
                          onClick={() => setRejectingId(null)}
                          className="px-6 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 rounded font-semibold transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleApproveCourse(course._id)}
                          disabled={processingId === course._id}
                          className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded font-semibold transition flex items-center gap-2"
                        >
                          {processingId === course._id && (
                            <span className="animate-spin">⏳</span>
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectingId(course._id)}
                          className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded font-semibold transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingCourses;
