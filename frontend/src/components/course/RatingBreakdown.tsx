import React from "react";
import { Star } from "lucide-react";

interface RatingStats {
  rating: number;
  totalReviews: number;
}

interface RatingBreakdownProps {
  ratings: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  averageRating?: number;
  totalReviews?: number;
}

const RatingBreakdown: React.FC<RatingBreakdownProps> = ({
  ratings,
  averageRating = 0,
  totalReviews = 0,
}) => {
  const total = ratings[5] + ratings[4] + ratings[3] + ratings[2] + ratings[1];

  const getRatingPercentage = (count: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  // Calculate recommendation percentage based on average rating
  const recommendedPercentage = totalReviews > 0 ? Math.round((averageRating / 5) * 100) : 0;

  const RatingRow: React.FC<{ stars: number; count: number; percentage: number }> = ({
    stars,
    count,
    percentage,
  }) => (
    <div className="flex items-center gap-3 mb-3">
      <div className="flex items-center gap-1 w-20">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < stars
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-400 to-amber-500 h-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Percentage */}
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-12">
        {percentage}%
      </p>

      {/* Count */}
      <p className="text-xs text-gray-500 dark:text-gray-400 min-w-16">
        ({count} reviews)
      </p>
    </div>
  );

  if (totalReviews === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          Course Ratings
        </h3>
        <div className="text-center py-8">
          <Star className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            No ratings yet
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Be the first to rate this course!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
        Course Ratings
      </h3>

      {/* Average Rating Summary */}
      <div className="flex items-start gap-6 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {averageRating.toFixed(1)}
          </p>
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(averageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-0">
          <RatingRow
            stars={5}
            count={ratings[5]}
            percentage={getRatingPercentage(ratings[5])}
          />
          <RatingRow
            stars={4}
            count={ratings[4]}
            percentage={getRatingPercentage(ratings[4])}
          />
          <RatingRow
            stars={3}
            count={ratings[3]}
            percentage={getRatingPercentage(ratings[3])}
          />
          <RatingRow
            stars={2}
            count={ratings[2]}
            percentage={getRatingPercentage(ratings[2])}
          />
          <RatingRow
            stars={1}
            count={ratings[1]}
            percentage={getRatingPercentage(ratings[1])}
          />
        </div>
      </div>

      {/* Recommendation Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-900 dark:bg-opacity-20 rounded-lg p-4">
          <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">
            Recommended
          </p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {recommendedPercentage}%
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg p-4">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
            Course Rating
          </p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {(averageRating / 5 * 100).toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default RatingBreakdown;
