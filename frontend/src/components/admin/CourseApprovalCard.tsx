import React from "react";
import { CheckCircle, XCircle, Clock, Users } from "lucide-react";
import { Course } from "../../types";
import Button from "../ui/Button";

interface CourseApprovalCardProps {
  course: Course;
  instructorName: string;
  submittedAt: string;
  onApprove: (courseId: string) => void;
  onReject: (courseId: string) => void;
}

const CourseApprovalCard: React.FC<CourseApprovalCardProps> = ({
  course,
  instructorName,
  submittedAt,
  onApprove,
  onReject,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {course.courseName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              By {instructorName}
            </p>
          </div>
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-semibold whitespace-nowrap">
            Pending Review
          </span>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Price
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              ₹{course.price}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Submitted
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {submittedAt}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
              <Users className="w-3 h-3" /> Lessons
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {course.courseContent?.length || 0}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            className="gap-2"
            onClick={() => onApprove(course._id)}
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 gap-2"
            onClick={() => onReject(course._id)}
          >
            <XCircle className="w-4 h-4" />
            Reject
          </Button>
          <Button variant="secondary" size="sm">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseApprovalCard;
