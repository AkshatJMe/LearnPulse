import React from "react";
import {
  Users,
  Clock,
  BarChart3,
  Award,
  Download,
  Share2,
  Heart,
} from "lucide-react";
import Button from "../ui/Button";

interface CourseMetaProps {
  price: number;
  studentsEnrolled?: number;
  totalDuration?: string;
  totalLessons?: number;
  language?: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  certificateIncluded?: boolean;
  onAddToCart?: () => void;
  onWishlistToggle?: () => void;
  isInWishlist?: boolean;
  onShare?: () => void;
}

const CourseMeta: React.FC<CourseMetaProps> = ({
  price,
  studentsEnrolled = 0,
  totalDuration = "Coming soon",
  totalLessons = 0,
  language = "English",
  level = "Intermediate",
  certificateIncluded = true,
  onAddToCart,
  onWishlistToggle,
  isInWishlist = false,
  onShare,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24">
      {/* Price */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
          Course Price
        </p>
        <p className="text-4xl font-bold text-gray-900 dark:text-white">
          ₹{price.toLocaleString()}
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-3 mb-6">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={onAddToCart}
        >
          Add to Cart
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={onWishlistToggle}
        >
          <Heart
            className={`w-5 h-5 mr-2 ${
              isInWishlist ? "fill-red-500 text-red-500" : ""
            }`}
          />
          {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        </Button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

      {/* Course Details Grid */}
      <div className="space-y-4 mb-6">
        {/* Enrolled Students */}
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Students Enrolled
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {studentsEnrolled > 0 ? studentsEnrolled.toLocaleString() + "+" : "Not yet"}
            </p>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Total Duration
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {totalDuration}
            </p>
          </div>
        </div>

        {/* Lessons */}
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Total Lessons
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Level */}
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Course Level
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {level}
            </p>
          </div>
        </div>

        {/* Language */}
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400">
            🌐
          </span>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Language</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {language}
            </p>
          </div>
        </div>

        {/* Certificate */}
        {certificateIncluded && (
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Certificate
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                Certificate of Completion
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

      {/* Share Button */}
      <button
        onClick={onShare}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-900 dark:text-white font-medium"
      >
        <Share2 className="w-4 h-4" />
        Share This Course
      </button>

      {/* Info Notice */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        30-day money-back guarantee. Full access on all devices.
      </p>
    </div>
  );
};

export default CourseMeta;
