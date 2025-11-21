import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { stripeEndpoints } from "../services/apis";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { resetCart } from "../slices/cartSlice";

interface PaymentDetails {
  courses: Array<{
    _id: string;
    courseName: string;
    thumbnail: string;
  }>;
  amount: number;
  createdAt: string;
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const sessionId = searchParams.get("session_id");
  const dispatch = useDispatch();
  //@ts-ignore
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        toast.error("Invalid payment session");
        navigate("/");
        return;
      }

      try {
        if (!token) {
          toast.error("Please login to verify payment");
          navigate("/login");
          return;
        }

        const response = await apiConnector({
          method: "POST",
          url: stripeEndpoints.VERIFY_SESSION_API,
          bodyData: { sessionId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setPaymentDetails(response.data.payment);
          dispatch(resetCart());
        } else {
          toast.error("Payment verification failed");
          navigate("/");
        }
      } catch (error: any) {
        console.error("Payment verification error:", error);
        toast.error(error.response?.data?.message || "Something went wrong");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [sessionId, navigate, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4 animate-bounce">
            <svg
              className="w-12 h-12 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            🎉 You're all set! Your courses are ready.
          </p>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h2>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Order Date:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {paymentDetails?.createdAt
                  ? new Date(paymentDetails.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </span>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Enrolled Courses ({paymentDetails?.courses.length || 0})
            </h3>
            <div className="space-y-3">
              {paymentDetails?.courses.map((course) => (
                <div
                  key={course._id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {course.courseName}
                    </h4>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ✓ Enrolled
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amount Paid */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Total Paid
              </span>
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                ${paymentDetails?.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/dashboard/enrolled-courses")}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Start Learning Now
            </span>
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold py-4 px-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Back to Home
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            📧 A confirmation email has been sent to your inbox
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Need help? Contact us at{" "}
            <a href="mailto:support@learnpulse.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              support@learnpulse.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
