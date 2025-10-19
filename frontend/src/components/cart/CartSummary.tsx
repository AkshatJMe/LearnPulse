import React from 'react';
import { Card, Input, Button } from '../ui';
import { Zap } from 'lucide-react';

interface CartSummaryProps {
  subtotal: number;
  tax?: number;
  discount?: number;
  couponCode?: string;
  onApplyCoupon?: (code: string) => void;
  onCheckout?: () => void;
  isLoading?: boolean;
  itemCount?: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  tax = 0,
  discount = 0,
  couponCode = '',
  onApplyCoupon,
  onCheckout,
  isLoading = false,
  itemCount = 0,
}) => {
  const [coupon, setCoupon] = React.useState('');
  const total = subtotal + tax - discount;

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleApply = () => {
    if (coupon.trim()) {
      onApplyCoupon?.(coupon);
    }
  };

  return (
    <Card className="sticky top-20 space-y-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order Summary</h3>

      {/* Coupon Section */}
      {onApplyCoupon && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleApply}
              icon={<Zap size={16} />}
            >
              Apply
            </Button>
          </div>
          {couponCode && (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              ✓ Coupon {couponCode} applied
            </p>
          )}
        </div>
      )}

      {/* Pricing Details */}
      <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <span>Subtotal ({itemCount} items)</span>
          <span>₹{formatCurrency(subtotal)}</span>
        </div>

        {tax > 0 && (
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>Tax</span>
            <span>₹{formatCurrency(tax)}</span>
          </div>
        )}

        {discount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Discount</span>
            <span>-₹{formatCurrency(discount)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-gray-900 dark:text-white text-lg">Total</span>
          <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
            ₹{formatCurrency(Math.max(0, total))}
          </span>
        </div>

        <Button
          variant="primary"
          className="w-full"
          onClick={onCheckout}
          isLoading={isLoading}
          disabled={itemCount === 0 || isLoading}
        >
          Proceed to Checkout
        </Button>
      </div>

      {/* Benefits */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-3 space-y-1 text-sm">
        <p className="text-gray-700 dark:text-gray-300 font-medium">✓ Lifetime access</p>
        <p className="text-gray-700 dark:text-gray-300 font-medium">✓ Certificate on completion</p>
        <p className="text-gray-700 dark:text-gray-300 font-medium">✓ 30-day money back guarantee</p>
      </div>
    </Card>
  );
};

export default CartSummary;
