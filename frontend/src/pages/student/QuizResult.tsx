import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiConnector } from "../../services/apiConnector";
import { quizEndpoints } from "../../services/apis";
import { toast } from "react-hot-toast";

interface QuizResult {
  _id: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: number;
  attemptNumber: number;
  submittedAt: string;
  quizId: {
    title: string;
    passingScore: number;
    attemptLimit: number;
  };
}

const QuizResult = () => {
  const navigate = useNavigate();
  const { resultId } = useParams();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  const fetchResult = async () => {
    try {
      const response = await apiConnector({
        method: "GET",
        url: `${quizEndpoints.GET_QUIZ_RESULTS_API}/${resultId}`
      });
      if (response.data.success) {
        setResult(response.data.result);
      }
    } catch (error: any) {
      console.error("Error fetching result:", error);
      toast.error("Failed to load quiz result");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 text-lg">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const isPassed = result.passed === 1;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isPassed ? 'from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900/20 dark:to-blue-900/20' : 'from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-900/20'} py-8 sm:py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-3xl mx-auto">
        {/* Result Animation */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${isPassed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'} mb-6 ${isPassed ? 'animate-bounce' : ''}`}>
            {isPassed ? (
              <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h1 className={`text-4xl font-bold mb-2 ${isPassed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isPassed ? '🎉 Congratulations!' : '📚 Keep Practicing!'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {isPassed ? 'You passed the quiz!' : "You didn't pass this time"}
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-6">
          {/* Header */}
          <div className={`bg-gradient-to-r ${isPassed ? 'from-green-600 to-emerald-600' : 'from-red-600 to-orange-600'} p-6 text-white`}>
            <h2 className="text-2xl font-bold mb-2">{result.quizId.title}</h2>
            <p className="text-sm opacity-90">
              Attempt {result.attemptNumber} of {result.quizId.attemptLimit}
            </p>
          </div>

          {/* Score Circle */}
          <div className="p-8 text-center">
            <div className="inline-flex flex-col items-center">
              <div className={`relative w-48 h-48 rounded-full border-8 ${isPassed ? 'border-green-500 dark:border-green-400' : 'border-red-500 dark:border-red-400'} flex items-center justify-center mb-6`}>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-gray-100 dark:to-gray-700 opacity-50"></div>
                <div className="relative text-center">
                  <div className={`text-6xl font-bold ${isPassed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {result.percentage}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {result.score} / {result.totalPoints} points
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {result.score}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Points Earned</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {result.quizId.passingScore}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Passing Score</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {result.quizId.attemptLimit - result.attemptNumber}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Attempt{result.quizId.attemptLimit - result.attemptNumber !== 1 ? 's' : ''} Left
                </div>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="px-8 pb-8">
            <div className={`p-4 rounded-xl ${isPassed ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'}`}>
              <div className="flex items-start gap-3">
                <svg className={`w-6 h-6 ${isPassed ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'} flex-shrink-0 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${isPassed ? 'text-green-900 dark:text-green-100' : 'text-yellow-900 dark:text-yellow-100'}`}>
                    {isPassed ? 'Well Done!' : 'Keep Going!'}
                  </h3>
                  <p className={`text-sm ${isPassed ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                    {isPassed
                      ? 'You have successfully completed this quiz. Your performance shows a strong understanding of the material.'
                      : `You scored ${result.percentage}% but need ${result.quizId.passingScore}% to pass. Review the material and try again!`}
                  </p>
                </div>
              </div>
            </div>

            {/* Submission Details */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Submitted on:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(result.submittedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {!isPassed && result.attemptNumber < result.quizId.attemptLimit && (
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry Quiz
              </span>
            </button>
          )}
          <button
            onClick={() => navigate('/dashboard/enrolled-courses')}
            className="flex-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold py-4 px-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Back to Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
