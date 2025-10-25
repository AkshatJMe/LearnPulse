import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Verified } from "lucide-react";
import Button from "../ui/Button";

interface Review {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    image?: string;
  };
  rating: number;
  review: string;
  createdAt: string;
}

interface CourseReviewsProps {
  reviews?: Review[];
  totalReviews?: number;
  onWriteReview?: () => void;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({
  reviews = [],
  totalReviews = 0,
  onWriteReview,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const totalPages = Math.ceil((reviews?.length || 0) / reviewsPerPage);

  const startIdx = (currentPage - 1) * reviewsPerPage;
  const endIdx = startIdx + reviewsPerPage;
  const paginatedReviews = reviews?.slice(startIdx, endIdx) || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Student Reviews
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {totalReviews} reviews from students
          </p>
        </div>
        <Button size="sm" onClick={onWriteReview}>
          Write a Review
        </Button>
      </div>

      {paginatedReviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No reviews yet. Be the first to share your experience!
          </p>
          <Button onClick={onWriteReview}>Write First Review</Button>
        </div>
      ) : (
        <>
          {/* Reviews List */}
          <div className="space-y-4 mb-6">
            {paginatedReviews.map((review) => (
              (() => {
                const reviewer = review?.userId || {
                  firstName: "Anonymous",
                  lastName: "User",
                  image: "",
                };
                const firstName = reviewer?.firstName || "Anonymous";
                const lastName = reviewer?.lastName || "User";
                const avatar =
                  reviewer?.image ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`;

                return (
              <div
                key={review._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatar}
                      alt={firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {firstName} {lastName}
                        </p>
                        <Verified className="w-4 h-4 text-blue-500" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {review.review}
                </p>

                {/* Helpful */}
                <div className="mt-3 flex items-center gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                    👍 Helpful
                  </button>
                  <button className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition">
                    👎 Not Helpful
                  </button>
                </div>
              </div>
                );
              })()
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded text-sm font-semibold transition ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white dark:bg-blue-500"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseReviews;
