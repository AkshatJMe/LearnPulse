import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { apiConnector } from "../../services/apiConnector";
import { courseEndpoints } from "../../services/apis";
import { deleteCourse } from "../../services/operations/adminAPI";

interface Course {
  _id: string;
  courseName: string;
  courseDescription: string;
  price: number;
  thumbnail: string;
  ratingAndReviews: any[];
  studentsEnrolled: any[];
  instructor: {
    firstName: string;
    lastName: string;
  };
  status: string;
  createdAt: string;
}

const CourseManagement: React.FC = () => {
  const { token } = useSelector((state: any) => state.auth);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      const response = await apiConnector({
        method: "GET",
        url: courseEndpoints.GET_ALL_COURSE_API,
      });

      if (response?.data?.success) {
        setCourses(response.data.data || []);
      } else {
        toast.error("Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleDeleteCourse = async (courseId: string, courseName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${courseName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setProcessingId(courseId);
      await deleteCourse(courseId, token);
      toast.success("Course deleted successfully!");
      fetchAllCourses();
    } catch (error: any) {
      console.error("Error deleting course:", error);
      toast.error(error?.message || "Failed to delete course");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredCourses = courses.filter((course) => {
    if (searchQuery.trim() === "") return true;
    return course.courseName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-2">Course Management</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Manage all courses on the platform</p>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search courses by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-96 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
        />
      </div>

      {filteredCourses.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg border border-gray-300 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No courses found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCourses.map((course) => (
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
                    className="w-full h-full object-cover rounded cursor-pointer hover:opacity-80 transition"
                    onClick={() => handleViewCourse(course)}
                  />
                </div>

                {/* Course Details */}
                <div className="flex-grow">
                  <h2 
                    className="text-2xl font-bold mb-2 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition"
                    onClick={() => handleViewCourse(course)}
                  >
                    {course.courseName}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {course.courseDescription}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-500">Instructor</p>
                      <p className="font-semibold">
                        {course.instructor.firstName} {course.instructor.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-500">Price</p>
                      <p className="font-semibold text-green-600 dark:text-green-400">₹{course.price}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-500">Students</p>
                      <p className="font-semibold">{course.studentsEnrolled?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-500">Reviews</p>
                      <p className="font-semibold">{course.ratingAndReviews?.length || 0}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        course.status === "Published"
                          ? "bg-green-900 text-green-200"
                          : "bg-yellow-900 text-yellow-200"
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="md:w-40 flex flex-col gap-2 justify-center">
                  <button
                    onClick={() => handleViewCourse(course)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id, course.courseName)}
                    disabled={processingId === course._id}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded font-semibold transition text-sm"
                  >
                    {processingId === course._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Detail Modal */}
      {showModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-300 dark:border-gray-700">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-200 dark:bg-gray-900 p-6 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{selectedCourse.courseName}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Thumbnail */}
              <img
                src={selectedCourse.thumbnail}
                alt={selectedCourse.courseName}
                className="w-full h-96 object-cover rounded-lg"
              />

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-300">{selectedCourse.courseDescription}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">Instructor</p>
                  <p className="text-lg font-semibold">
                    {selectedCourse.instructor.firstName}{" "}
                    {selectedCourse.instructor.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">Price</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    ₹{selectedCourse.price}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">Status</p>
                  <p
                    className={`text-lg font-semibold ${
                      selectedCourse.status === "Published"
                        ? "text-green-600 dark:text-green-400"
                        : "text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {selectedCourse.status}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">Created</p>
                  <p className="text-lg font-semibold">
                    {new Date(selectedCourse.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">Students Enrolled</p>
                  <p className="text-lg font-semibold">
                    {selectedCourse.studentsEnrolled?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">Reviews & Ratings</p>
                  <p className="text-lg font-semibold">
                    {selectedCourse.ratingAndReviews?.length || 0}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 border-t border-gray-300 dark:border-gray-700">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 rounded font-semibold transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDeleteCourse(selectedCourse._id, selectedCourse.courseName);
                    setShowModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded font-semibold transition"
                >
                  Delete Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-gray-600 dark:text-gray-400">
        <p>
          Total Courses: <span className="font-semibold">{filteredCourses.length}</span> /{" "}
          <span className="text-gray-500 dark:text-gray-500">{courses.length}</span>
        </p>
      </div>
    </div>
  );
};

export default CourseManagement;
