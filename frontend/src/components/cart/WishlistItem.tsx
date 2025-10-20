import React from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Button from "../ui/Button";
import { Course } from "../../types";

interface WishlistItemProps {
  course: Course;
  onAddToCart: () => void;
  onRemove: () => void;
  isLoading?: boolean;
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  course,
  onAddToCart,
  onRemove,
  isLoading = false,
}) => {
  const instructor =
    typeof course.instructor === "string"
      ? { firstName: "", lastName: "" }
      : course.instructor;

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* Course Thumbnail */}
        {course.thumbnail && (
          <div className="md:w-48 h-40 md:h-40 flex-shrink-0 rounded-lg overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.courseName}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => window.location.href = `/course/${course._id}`}
            />
          </div>
        )}

        {/* Course Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition"
              onClick={() => window.location.href = `/course/${course._id}`}
            >
              {course.courseName}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              By{" "}
              <span className="font-medium">
                {instructor.firstName} {instructor.lastName}
              </span>
            </p>

            {/* Rating and Stats */}
            <div className="flex flex-wrap items-center gap-4 mb-3">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(Number(averageRating))
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {averageRating}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  ({course.ratingAndReviews?.length || 0})
                </span>
              </div>

              {/* Students */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                👥 {course.studentsEnrolled?.length || 0} students
              </div>
            </div>

            {/* Status Badge */}
            {course.status && (
              <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium mb-3">
                {course.status}
              </span>
            )}
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex flex-col justify-between items-end gap-4 md:min-w-max">
          {/* Price */}
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{course.price?.toLocaleString() || 0}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <Button
              variant="primary"
              size="sm"
              className="w-full md:w-40 gap-2 justify-center"
              onClick={onAddToCart}
              disabled={isLoading}
            >
              <ShoppingCart className="w-4 h-4" />
              {isLoading ? "Adding..." : "Add to Cart"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-full md:w-40 gap-2 justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={onRemove}
              disabled={isLoading}
            >
              <Heart className="w-4 h-4 fill-current" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
