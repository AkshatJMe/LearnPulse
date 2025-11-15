import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCourses } from "../services/operations/courseDetailsAPI";

type Course = {
  _id: string;
  courseName: string;
  courseDescription?: string;
  thumbnail?: string;
  price?: number;
  instructor?: {
    firstName?: string;
    lastName?: string;
  };
  category?: {
    name?: string;
  };
};

const Catalog = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return courses;

    return courses.filter((course) => {
      const courseName = (course.courseName || "").toLowerCase();
      const description = (course.courseDescription || "").toLowerCase();
      const instructorName = `${course.instructor?.firstName || ""} ${course.instructor?.lastName || ""}`.toLowerCase();
      const categoryName = (course.category?.name || "").toLowerCase();

      return (
        courseName.includes(term) ||
        description.includes(term) ||
        instructorName.includes(term) ||
        categoryName.includes(term)
      );
    });
  }, [courses, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Course Catalog
        </h1>

        <div className="mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses by title, instructor, category..."
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {loading
              ? "Loading courses..."
              : `${filteredCourses.length} course${filteredCourses.length === 1 ? "" : "s"} found`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-72 rounded-xl bg-white dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-10 text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              No courses found
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Try a different search keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <button
                key={course._id}
                onClick={() => navigate(`/course/${course._id}`)}
                className="text-left bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <img
                  src={course.thumbnail || "https://via.placeholder.com/600x350?text=Course"}
                  alt={course.courseName}
                  className="w-full h-44 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                    {course.courseName}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {course.courseDescription || "No description available"}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      {course.instructor?.firstName || "Instructor"} {course.instructor?.lastName || ""}
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      ₹{course.price ?? 0}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
