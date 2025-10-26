import React from "react";
import { User, Users, Award } from "lucide-react";
import Button from "../ui/Button";

interface Instructor {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  bio?: string;
}

interface InstructorCardProps {
  instructor: Instructor;
  coursesCount?: number;
  studentsCount?: number;
  rating?: number;
  onContactClick?: () => void;
}

const InstructorCard: React.FC<InstructorCardProps> = ({
  instructor,
  coursesCount = 8,
  studentsCount = 45000,
  rating = 4.8,
  onContactClick,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Meet Your Instructor
      </h3>

      <div className="flex gap-4 mb-4">
        {/* Instructor Avatar */}
        <div className="flex-shrink-0">
          <img
            src={
              instructor.image ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${instructor.firstName}`
            }
            alt={`${instructor.firstName} ${instructor.lastName}`}
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
          />
        </div>

        {/* Instructor Info */}
        <div className="flex-1">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
            {instructor.firstName} {instructor.lastName}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {instructor.email}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
                <p className="font-bold text-gray-900 dark:text-white">
                  {rating.toFixed(1)} ★
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Students
                </p>
                <p className="font-bold text-gray-900 dark:text-white">
                  {studentsCount.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Courses
                </p>
                <p className="font-bold text-gray-900 dark:text-white">
                  {coursesCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      {instructor.bio && (
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 leading-relaxed">
          {instructor.bio}
        </p>
      )}

      {/* CTA Buttons */}
      <div className="flex gap-3 mt-4">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={onContactClick}
        >
          Contact Instructor
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
        >
          View All Courses
        </Button>
      </div>
    </div>
  );
};

export default InstructorCard;
