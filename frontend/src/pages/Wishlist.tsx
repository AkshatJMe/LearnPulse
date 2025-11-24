import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import WishlistItem from "../components/cart/WishlistItem";
import { Heart, ArrowLeft, AlertCircle } from "lucide-react";
import Button from "../components/ui/Button";
import { Course } from "../types";

interface WishlistState {
  loading: boolean;
  error: string | null;
  actionLoading: string | null;
}

const Wishlist = () => {
  const navigate = useNavigate();
  
  //@ts-ignore
  const { user } = useSelector((state) => state.profile);
  //@ts-ignore
  const { wishlist } = useSelector((state) => state.profile);

  const [wishlistItems, setWishlistItems] = useState<Course[]>(wishlist || []);
  const [wishlistState, setWishlistState] = useState<WishlistState>({
    loading: false,
    error: null,
    actionLoading: null,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Sync wishlist from Redux
    if (wishlist) {
      setWishlistItems(wishlist);
    }

    // TODO: Fetch wishlist from backend
    // const fetchWishlist = async () => {
    //   try {
    //     setWishlistState(prev => ({ ...prev, loading: true }));
    //     const response = await apiConnector('GET', '/wishlist', {
    //       headers: { Authorization: `Bearer ${token}` }
    //     });
    //     setWishlistItems(response.data.wishlist.courses);
    //   } catch (error) {
    //     setWishlistState(prev => ({
    //       ...prev,
    //       error: error instanceof Error ? error.message : 'Failed to load wishlist'
    //     }));
    //   } finally {
    //     setWishlistState(prev => ({ ...prev, loading: false }));
    //   }
    // };
    // fetchWishlist();
  }, [user, wishlist, navigate]);

  const handleRemoveFromWishlist = async (courseId: string) => {
    try {
      setWishlistState(prev => ({ ...prev, actionLoading: courseId }));

      // Update local state
      setWishlistItems(prev => prev.filter(course => course._id !== courseId));

      // TODO: Call backend to remove from wishlist
      // await apiConnector('DELETE', '/wishlist/remove', {
      //   courseId,
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      // TODO: Dispatch Redux action
      // dispatch(removeFromWishlist(courseId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      setWishlistState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to remove from wishlist'
      }));
      // Revert state
      setWishlistItems(wishlist);
    } finally {
      setWishlistState(prev => ({ ...prev, actionLoading: null }));
    }
  };

  const handleAddToCart = async (courseId: string) => {
    try {
      setWishlistState(prev => ({ ...prev, actionLoading: courseId }));

      // TODO: Call backend to add to cart
      // await apiConnector('POST', '/cart/add', {
      //   courseId,
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      // TODO: Dispatch Redux actions
      // dispatch(addToCart(course));
      // Remove from wishlist
      // await handleRemoveFromWishlist(courseId);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setWishlistState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to add to cart'
      }));
    } finally {
      setWishlistState(prev => ({ ...prev, actionLoading: null }));
    }
  };

  if (wishlistState.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Login Required
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Please log in to view your wishlist
        </p>
        <Button
          variant="primary"
          onClick={() => navigate("/login")}
          className="gap-2"
        >
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              My Wishlist
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {wishlistItems.length} course{wishlistItems.length !== 1 ? "s" : ""} saved for later
          </p>
        </div>

        {/* Error Alert */}
        {wishlistState.error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-200">Error</p>
                <p className="text-sm text-red-800 dark:text-red-300">
                  {wishlistState.error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty Wishlist State */}
        {wishlistItems.length === 0 ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Your Wishlist is Empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Start adding courses to your wishlist to save them for later and keep track
                of courses you're interested in learning.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/catalog")}
                className="gap-2"
              >
                Browse Courses
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {wishlistItems.map((course) => (
                <WishlistItem
                  key={course._id}
                  course={course}
                  onAddToCart={() => handleAddToCart(course._id)}
                  onRemove={() => handleRemoveFromWishlist(course._id)}
                  isLoading={wishlistState.actionLoading === course._id}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate("/catalog")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/cart")}
              >
                Go to Cart
              </Button>
            </div>
          </div>
        )}
      </div>
  );
};

export default Wishlist;
