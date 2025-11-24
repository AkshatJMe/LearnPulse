import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiConnector } from "../../services/apiConnector";
import { quizEndpoints } from "../../services/apis";
import { toast } from "react-hot-toast";

interface Question {
  _id: string;
  questionText: string;
  options: string[];
  points: number;
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  duration: number;
  passingScore: number;
  attemptLimit: number;
  questions: Question[];
}

const TakeQuiz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchQuiz = async () => {
    try {
      const response = await apiConnector({
        method: "GET",
        url: `${quizEndpoints.GET_QUIZ_API}/${quizId}`
      });
      if (response.data.success) {
        setQuiz(response.data.quiz);
        setTimeLeft(response.data.quiz.duration * 60); // Convert to seconds
      }
    } catch (error: any) {
      console.error("Error fetching quiz:", error);
      toast.error("Failed to load quiz");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < (quiz?.questions.length || 0)) {
      const confirmSubmit = window.confirm(
        "You haven't answered all questions. Submit anyway?"
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    try {
      const response = await apiConnector({
        method: "POST",
        url: quizEndpoints.SUBMIT_QUIZ_API,
        bodyData: {
          quizId,
          answers,
        }
      });

      if (response.data.success) {
        toast.success("Quiz submitted successfully!");
        navigate(`/quiz-result/${response.data.result._id}`);
      }
    } catch (error: any) {
      console.error("Error submitting quiz:", error);
      toast.error(error.response?.data?.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isAnswered = (questionId: string) => questionId in answers;
  const progress = quiz
    ? (Object.keys(answers).length / quiz.questions.length) * 100
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Timer */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {quiz.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{quiz.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div
                className={`text-3xl font-bold ${
                  timeLeft < 60
                    ? "text-red-600 dark:text-red-400 animate-pulse"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              >
                ⏱️ {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Passing: {quiz.passingScore}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Progress</span>
              <span>
                {Object.keys(answers).length} / {quiz.questions.length} answered
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {quiz.questions.map((q, index) => (
              <button
                key={q._id}
                onClick={() => setCurrentQuestion(index)}
                className={`w-12 h-12 rounded-lg font-semibold transition-all ${
                  currentQuestion === index
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110"
                    : isAnswered(q._id)
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-500"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Current Question */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {quiz.questions[currentQuestion].points} points
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-relaxed">
              {quiz.questions[currentQuestion].questionText}
            </h2>
          </div>

          <div className="space-y-3">
            {quiz.questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() =>
                  handleAnswerSelect(quiz.questions[currentQuestion]._id, index)
                }
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[quiz.questions[currentQuestion]._id] === index
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400 shadow-md"
                    : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      answers[quiz.questions[currentQuestion]._id] === index
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-400 dark:border-gray-500"
                    }`}
                  >
                    {answers[quiz.questions[currentQuestion]._id] === index && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {String.fromCharCode(65 + index)}. {option}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="sm:w-auto bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold py-4 px-8 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </span>
          </button>

          <div className="flex-1"></div>

          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              onClick={() =>
                setCurrentQuestion((prev) => Math.min(quiz.questions.length - 1, prev + 1))
              }
              className="sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submit Quiz
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
