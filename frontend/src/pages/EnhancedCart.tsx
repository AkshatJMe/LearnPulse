import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { cartEndpoints, stripeEndpoints } from "../services/apis";
import { toast } from "react-hot-toast";
import { setCart } from "../slices/cartSlice";
import { validateCoupon } from "../services/operations/couponAPI";

interface Course {
  _id: string;
  courseName: string;
  thumbnail: string;
  instructor: {
    firstName: string;
    lastName: string;
  };
  price: number;
  category: {
    name: string;
  };
  averageRating?: number;
  totalRatings?: number;
}

interface Coupon {
  code: string;
  discount: number;
  discountType: "percent" | "fixed";
  isActive: boolean;
  expiryDate: string;
}

const EnhancedCart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //@ts-ignore
  const { cart } = useSelector((state) => state.cart);
  //@ts-ignore
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce((total: number, course: Course) => total + course.price, 0);
  };

  // Calculate discount
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = calculateSubtotal();
    if (appliedCoupon.discountType === "percent") {
      return (subtotal * appliedCoupon.discount) / 100;
    } else {
      return appliedCoupon.discount;
    }
  };

  // Calculate total
  const calculateTotal = () => {
    return Math.max(0, calculateSubtotal() - calculateDiscount());
  };

  // Apply coupon
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setCheckingCoupon(true);
    try {
      const couponResult = await validateCoupon(couponCode, calculateSubtotal());

      if (couponResult?.coupon) {
        const mappedCoupon: Coupon = {
          code: couponResult.coupon.code,
          discountType: couponResult.coupon.discountType,
          discount:
            couponResult.coupon.discountType === "percent"
              ? Number(couponResult.coupon.discountPercent || 0)
              : Number(couponResult.coupon.discountAmount || 0),
          isActive: true,
          expiryDate: "",
        };
        setAppliedCoupon(mappedCoupon);
        toast.success("Coupon applied successfully");
      }
    } catch (error: any) {
      console.error("Error applying coupon:", error);
      toast.error(error.response?.data?.message || "Invalid or expired coupon");
    } finally {
      setCheckingCoupon(false);
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  // Remove from cart
  const removeFromCart = async (courseId: string) => {
    if (!token) {
      toast.error("Please login to update cart");
      navigate("/login");
      return;
    }

    try {
      const response = await apiConnector({
        method: "DELETE",
        url: cartEndpoints.REMOVE_FROM_CART_API,
        bodyData: { courseId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Course removed from cart");
        dispatch(setCart(response.data?.cart?.courses || []));
      }
    } catch (error: any) {
      console.error("Error removing from cart:", error);
      toast.error(error.response?.data?.message || "Failed to remove course");
    }
  };

  // Checkout with Stripe
  const handleCheckout = async () => {
    if (!token) {
      toast.error("Please login to continue checkout");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const courseIds = cart.map((course: Course) => course._id);
      const response = await apiConnector({
        method: "POST",
        url: stripeEndpoints.CREATE_CHECKOUT_SESSION_API,
        bodyData: {
          courseIds,
          couponCode: appliedCoupon?.code,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success && response.data.sessionUrl) {
        window.location.href = response.data.sessionUrl;
      } else {
        toast.error(response.data?.message || "Failed to initiate checkout");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      toast.error(error.response?.data?.message || "Failed to initiate checkout");
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-16 h-16 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start adding courses to your cart to continue learning
            </p>
            <button
              onClick={() => navigate("/catalog")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🛒 Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {cart.length} {cart.length === 1 ? "course" : "courses"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((course: Course) => (
              <div
                key={course._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail */}
                  <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0">
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {course.courseName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        By {course.instructor.firstName} {course.instructor.lastName}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg">
                          {course.category?.name}
                        </span>
                        {course.averageRating && (
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4 text-yellow-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{course.averageRating.toFixed(1)}</span>
                            <span className="text-gray-400">({course.totalRatings})</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        ${course.price}
                      </span>
                      <button
                        onClick={() => removeFromCart(course._id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium flex items-center gap-2 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              {/* Coupon Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Coupon Code
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-semibold text-green-700 dark:text-green-300">
                        {appliedCoupon.code}
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={checkingCoupon}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-xl transition-colors disabled:cursor-not-allowed"
                    >
                      {checkingCoupon ? "..." : "Apply"}
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>
                      Discount{" "}
                      {appliedCoupon.discountType === "percent"
                        ? `(${appliedCoupon.discount}%)`
                        : ""}
                    </span>
                    <span className="font-semibold">-${calculateDiscount().toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    Proceed to Checkout
                  </span>
                )}
              </button>

              {/* Security Note */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Secure checkout powered by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCart;
