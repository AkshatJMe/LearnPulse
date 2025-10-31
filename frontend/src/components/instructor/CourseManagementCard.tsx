import React from "react";
import { Edit2, Trash2, BarChart3, Eye, Users } from "lucide-react";
import Button from "../ui/Button";
import { Course } from "../../types";

interface CourseManagementCardProps {
  course: Course;
  onEdit: (courseId: string) => void;
  onDelete: (courseId: string) => void;
  onView: (courseId: string) => void;
}

const CourseManagementCard: React.FC<CourseManagementCardProps> = ({
  course,
  onEdit,
  onDelete,
  onView,
}) => {
  const studentCount = course.studentsEnrolled?.length || 0;
  const averageRating =
    course.ratingAndReviews && course.ratingAndReviews.length > 0
      ? (
          course.ratingAndReviews.reduce(
            (sum: number, review: any) => sum + (review.rating || 0),
            0
          ) / course.ratingAndReviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex gap-4 mb-4">
        {/* Thumbnail */}
        {course.thumbnail && (
          <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.courseName}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Course Info */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {course.courseName}
          </h3>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              {studentCount} students
            </div>

            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              ⭐ {averageRating} rating
            </div>

            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              {course.courseContent?.reduce(
                (acc: number, section: any) =>
                  acc + (section.subSection?.length || 0),
                0
              ) || 0}{" "}
              lessons
            </div>
          </div>

          {/* Price */}
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-2">
            ₹{course.price?.toLocaleString() || 0}
          </p>
        </div>

        {/* Status */}
        <div className="flex-shrink-0">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              course.status === "Published"
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
            }`}
          >
            {course.status || "Draft"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 gap-2 justify-center"
          onClick={() => onView(course._id)}
        >
          <Eye className="w-4 h-4" />
          View
        </Button>

        <Button
          variant="secondary"
          size="sm"
          className="flex-1 gap-2 justify-center"
          onClick={() => onEdit(course._id)}
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-2 justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDelete(course._id)}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default CourseManagementCard;
