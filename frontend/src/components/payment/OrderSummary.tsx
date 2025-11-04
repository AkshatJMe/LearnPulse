import React from "react";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import { Course } from "../../types";

interface OrderSummaryProps {
  courses: Course[];
  onRemove: (courseId: string) => void;
  couponCode?: string;
  discountAmount?: number;
  onApplyCoupon?: (code: string) => void;
  onCheckout?: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  courses,
  onRemove,
  couponCode = "",
  discountAmount = 0,
  onApplyCoupon,
  onCheckout,
}) => {
  const subtotal = courses.reduce((sum, course) => sum + (course.price || 0), 0);
  const totalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(totalAfterDiscount * 0.18 * 100) / 100; // 18% GST
  const finalTotal = totalAfterDiscount + taxAmount;

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-32">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Order Summary
      </h2>

      {/* Courses List */}
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {courses.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No courses selected</p>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course._id}
              className="flex items-start justify-between gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                  {course.courseName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ₹{formatCurrency(course.price || 0)}
                </p>
              </div>
              <button
                onClick={() => onRemove(course._id)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

      {/* Coupon Section */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Promo code"
            defaultValue={couponCode}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              const code = (
                document.querySelector(
                  'input[placeholder="Promo code"]'
                ) as HTMLInputElement
              )?.value;
              if (code && onApplyCoupon) {
                onApplyCoupon(code);
              }
            }}
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Pricing Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            ₹{formatCurrency(subtotal)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600 dark:text-green-400">
              Discount ({couponCode})
            </span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              -₹{formatCurrency(discountAmount)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Tax (18% GST)
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            ₹{formatCurrency(taxAmount)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

      {/* Total */}
      <div className="mb-6 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 dark:bg-opacity-20 rounded-lg p-4">
        <span className="font-bold text-gray-900 dark:text-white">
          Total Amount
        </span>
        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          ₹{formatCurrency(finalTotal)}
        </span>
      </div>

      {/* CTA Button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={onCheckout}
        disabled={courses.length === 0}
      >
        Proceed to Checkout
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      {/* Trust Badges */}
      <div className="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-400 text-center">
        <p>✓ Secure payment with Stripe</p>
        <p>✓ 30-day money-back guarantee</p>
        <p>✓ Instant course access</p>
      </div>
    </div>
  );
};

export default OrderSummary;
