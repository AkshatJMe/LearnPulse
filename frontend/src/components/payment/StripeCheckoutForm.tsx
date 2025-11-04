import React, { useState } from "react";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";
import Button from "../ui/Button";

interface StripeCheckoutFormProps {
  amount: number;
  courseCount: number;
  onSuccess: (paymentDetails: PaymentDetails) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

export interface PaymentDetails {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  amount: number;
}

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({
  amount,
  courseCount,
  onSuccess,
  onError,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [paymentMessage, setPaymentMessage] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    if (!formData.cardNumber.replace(/\s/g, "")) {
      newErrors.cardNumber = "Card number is required";
    } else if (!/^\d{13,19}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Card number must be 13-19 digits";
    }

    if (!formData.expiryMonth || !formData.expiryYear) {
      newErrors.expiry = "Expiry date is required";
    } else {
      const month = parseInt(formData.expiryMonth);
      if (month < 1 || month > 12) {
        newErrors.expiryMonth = "Month must be 01-12";
      }
    }

    if (!formData.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV must be 3-4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === "cardNumber") {
      const cleaned = value.replace(/\s/g, "");
      const formatted = cleaned.replace(/(\d{4})/g, "$1 ").trim();
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setPaymentStatus("error");
      setPaymentMessage("Please fix the errors above");
      return;
    }

    setIsSubmitting(true);
    setPaymentStatus("processing");
    setPaymentMessage("Processing your payment...");

    try {
      // Simulate API call to backend
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real implementation, this would call:
      // const response = await apiConnector('POST', '/payments/stripe', {
      //   amount,
      //   cardNumber: formData.cardNumber.replace(/\s/g, ''),
      //   expiryMonth: parseInt(formData.expiryMonth),
      //   expiryYear: parseInt(formData.expiryYear),
      //   cvv: formData.cvv,
      //   cardholderName: formData.cardholderName,
      // });

      setPaymentStatus("success");
      setPaymentMessage("Payment successful! 🎉");

      setTimeout(() => {
        onSuccess({
          cardholderName: formData.cardholderName,
          cardNumber: formData.cardNumber,
          expiryMonth: parseInt(formData.expiryMonth),
          expiryYear: parseInt(formData.expiryYear),
          cvv: formData.cvv,
          amount,
        });
      }, 1500);
    } catch (error) {
      setPaymentStatus("error");
      setPaymentMessage(
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again."
      );
      onError(paymentMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (paymentStatus === "success") {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {paymentMessage}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your payment has been processed successfully. You now have access to{" "}
          {courseCount} course{courseCount > 1 ? "s" : ""}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Payment Status Alert */}
      {paymentStatus === "error" && (
        <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900 dark:text-red-200">
              Payment Failed
            </p>
            <p className="text-sm text-red-800 dark:text-red-300">
              {paymentMessage}
            </p>
          </div>
        </div>
      )}

      {paymentStatus === "processing" && (
        <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <Loader className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 animate-spin" />
          <p className="text-sm text-blue-900 dark:text-blue-200">
            {paymentMessage}
          </p>
        </div>
      )}

      {/* Cardholder Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Cardholder Name *
        </label>
        <input
          type="text"
          name="cardholderName"
          placeholder="John Doe"
          value={formData.cardholderName}
          onChange={handleInputChange}
          disabled={isSubmitting || isLoading}
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition ${
            errors.cardholderName
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {errors.cardholderName && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {errors.cardholderName}
          </p>
        )}
      </div>

      {/* Card Number */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Card Number *
        </label>
        <div className="relative">
          <input
            type="text"
            name="cardNumber"
            placeholder="4532 1234 5678 9010"
            value={formData.cardNumber}
            onChange={handleInputChange}
            disabled={isSubmitting || isLoading}
            maxLength={24}
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition ${
              errors.cardNumber
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            💳
          </span>
        </div>
        {errors.cardNumber && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {errors.cardNumber}
          </p>
        )}
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Expiry Date *
          </label>
          <div className="flex gap-2">
            <select
              name="expiryMonth"
              value={formData.expiryMonth}
              onChange={handleInputChange}
              disabled={isSubmitting || isLoading}
              className={`flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition ${
                errors.expiryMonth || errors.expiry
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <option value="">MM</option>
              {[...Array(12)].map((_, i) => (
                <option
                  key={i}
                  value={String(i + 1).padStart(2, "0")}
                >
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
            <select
              name="expiryYear"
              value={formData.expiryYear}
              onChange={handleInputChange}
              disabled={isSubmitting || isLoading}
              className={`flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition ${
                errors.expiryYear || errors.expiry
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <option value="">YY</option>
              {[...Array(10)].map((_, i) => {
                const year = new Date().getFullYear() + i;
                return (
                  <option key={i} value={String(year).slice(-2)}>
                    {String(year).slice(-2)}
                  </option>
                );
              })}
            </select>
          </div>
          {(errors.expiryMonth || errors.expiryYear || errors.expiry) && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {errors.expiryMonth || errors.expiryYear || errors.expiry}
            </p>
          )}
        </div>

        {/* CVV */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            CVV *
          </label>
          <input
            type="text"
            name="cvv"
            placeholder="123"
            value={formData.cvv}
            onChange={handleInputChange}
            disabled={isSubmitting || isLoading}
            maxLength={4}
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition ${
              errors.cvv
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.cvv && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {errors.cvv}
            </p>
          )}
        </div>
      </div>

      {/* Amount Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Amount to pay:</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{amount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isSubmitting || isLoading}
      >
        {isSubmitting || isLoading ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay ₹${amount.toLocaleString()}`
        )}
      </Button>

      {/* Security Notice */}
      <p className="text-xs text-center text-gray-600 dark:text-gray-400">
        🔒 Your payment information is encrypted and secure. We never store your full
        card details.
      </p>
    </form>
  );
};

export default StripeCheckoutForm;
