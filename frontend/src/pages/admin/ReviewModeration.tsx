import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { removeReview } from "../../services/operations/adminAPI";
import { apiConnector } from "../../services/apiConnector";

interface Review {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  course: {
    courseName: string;
    instructor: {
      firstName: string;
      lastName: string;
    };
  };
  rating: number;
  review: string;
  createdAt: string;
}

const ReviewModeration: React.FC = () => {
  const { token } = useSelector((state: any) => state.auth);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Get all ratings/reviews from the database
      const response = await apiConnector({
        method: "GET",
        url: "http://localhost:4000/api/v1/course/getReviews",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.success) {
        setReviews(response.data.data || []);
      } else {
        toast.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveReview = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to remove this review?")) {
      return;
    }

    try {
      setProcessingId(reviewId);
      await removeReview(reviewId, token);
      toast.success("Review removed successfully!");
      fetchReviews();
    } catch (error) {
      console.error("Error removing review:", error);
      toast.error("Failed to remove review");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-2">Review Moderation</h1>
      <p className="text-gray-400 mb-8">Manage course reviews and ratings</p>

      {reviews.length === 0 ? (
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
          <p className="text-gray-400 text-lg">No reviews to moderate</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((reviewItem) => (
            <div
              key={reviewItem._id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-lg font-semibold">
                    {reviewItem.user.firstName} {reviewItem.user.lastName}
                  </p>
                  <p className="text-sm text-gray-400">{reviewItem.user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">
                    {new Date(reviewItem.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Course & Instructor Info */}
              <div className="mb-4 p-3 bg-gray-700 rounded">
                <p className="text-sm font-semibold">{reviewItem.course.courseName}</p>
                <p className="text-xs text-gray-400">
                  Instructor: {reviewItem.course.instructor.firstName}{" "}
                  {reviewItem.course.instructor.lastName}
                </p>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">★</span>
                  <span className="font-semibold">{reviewItem.rating.toFixed(1)}</span>
                  <span className="text-gray-500">/ 5.0</span>
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-4">
                <p className="text-gray-300">{reviewItem.review}</p>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleRemoveReview(reviewItem._id)}
                  disabled={processingId === reviewItem._id}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded font-semibold transition flex items-center gap-2"
                >
                  {processingId === reviewItem._id && (
                    <span className="animate-spin">⏳</span>
                  )}
                  Remove Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-gray-400">
        <p>Total Reviews: <span className="font-semibold">{reviews.length}</span></p>
      </div>
    </div>
  );
};

export default ReviewModeration;
