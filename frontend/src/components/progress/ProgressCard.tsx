import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, BookOpen, Award, PlayCircle } from "lucide-react";
import { CourseProgress, Course } from "../../types";
import ProgressBar from "./ProgressBar";
import Button from "../ui/Button";

interface ProgressCardProps {
  progress: CourseProgress;
  course?: Course; // Populated course data
  onContinue?: () => void;
  className?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  progress,
  course,
  onContinue,
  className = "",
}) => {
  const navigate = useNavigate();

  const displayCourse = course || {
    _id: progress.courseId,
    courseName: progress.courseName || "Untitled Course",
    thumbnail: progress.thumbnail || "/placeholder-course.jpg",
    instructor: progress.instructor || { firstName: "Instructor", lastName: "" },
    totalDuration: "10 hours",
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      navigate(`/dashboard/certificates`);
    }
  };

  const handleViewCertificate = () => {
    if (progress.certificateId) {
      navigate(`/certificate/${progress.certificateId}`);
    }
  };

  // Calculate stats
  const totalVideos = (course?.courseContent || []).reduce(
    (acc, section) => acc + (section.subSection?.length || 0),
    0
  );
  const completedVideos = progress.completedVideos?.length || 0;
  // Note: Quizzes are tracked separately in the backend
  const totalQuizzes = 0; // TODO: Get from backend API
  const completedQuizzes = progress.completedQuizzes?.length || 0;

  const isCompleted = progress.progressPercentage >= 100;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden ${className}`}
    >
      {/* Course Thumbnail */}
      <div className="relative h-40 overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={typeof displayCourse.thumbnail === "string" ? displayCourse.thumbnail : "/placeholder-course.jpg"}
          alt={displayCourse.courseName}
          className="w-full h-full object-cover"
        />
        {isCompleted && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Award className="w-3 h-3" />
            Completed
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Course Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {displayCourse.courseName}
        </h3>

        {/* Instructor */}
        {typeof displayCourse.instructor === "object" &&
          (displayCourse.instructor.firstName || displayCourse.instructor.lastName) && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            by {displayCourse.instructor.firstName} {displayCourse.instructor.lastName}
          </p>
        )}

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress
              </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {Math.round(progress.progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  isCompleted
                    ? "bg-green-500"
                    : progress.progressPercentage >= 75
                    ? "bg-blue-500"
                    : progress.progressPercentage >= 50
                    ? "bg-yellow-500"
                    : "bg-orange-500"
                }`}
                style={{ width: `${progress.progressPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="ml-4">
            <ProgressBar
              percentage={progress.progressPercentage}
              size="sm"
              showLabel={false}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <PlayCircle className="w-4 h-4" />
            <span>
              {completedVideos}/{totalVideos || 0} Videos
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <BookOpen className="w-4 h-4" />
            <span>
              {completedQuizzes}/{totalQuizzes || 0} Quizzes
            </span>
          </div>
        </div>

        {/* Last Updated */}
        {progress.updatedAt && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mb-4">
            <Clock className="w-3 h-3" />
            Last updated: {new Date(progress.updatedAt).toLocaleDateString()}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {isCompleted && progress.certificateId ? (
            <Button
              onClick={handleViewCertificate}
              className="flex-1"
              variant="secondary"
            >
              <Award className="w-4 h-4 mr-2" />
              View Certificate
            </Button>
          ) : (
            <Button onClick={handleContinue} className="flex-1">
              <PlayCircle className="w-4 h-4 mr-2" />
              {progress.progressPercentage > 0 ? "Continue Learning" : "Start Learning"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
