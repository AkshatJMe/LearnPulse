import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiConnector } from "../../services/apiConnector";
import { quizEndpoints } from "../../services/apis";
import { toast } from "react-hot-toast";

interface Question {
  questionText: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { token } = useSelector((state: any) => state.auth);
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    duration: 30,
    passingScore: 70,
    attemptLimit: 3,
  });
  const [questions, setQuestions] = useState<Question[]>([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 10,
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 10,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    (updatedQuestions[index] as any)[field] = value;
    setQuestions(updatedQuestions);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!quizData.title.trim()) {
      toast.error("Please enter quiz title");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].questionText.trim()) {
        toast.error(`Question ${i + 1} text is required`);
        return;
      }
      const hasEmptyOption = questions[i].options.some((opt) => !opt.trim());
      if (hasEmptyOption) {
        toast.error(`All options for question ${i + 1} are required`);
        return;
      }
    }

    setLoading(true);
    try {
      const response = await apiConnector({
        method: "POST",
        url: quizEndpoints.CREATE_QUIZ_API,
        bodyData: {
          courseId,
          ...quizData,
          questions,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Quiz created successfully!");
        navigate(`/dashboard/my-courses`);
      }
    } catch (error: any) {
      console.error("Error creating quiz:", error);
      toast.error(error.response?.data?.message || "Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Quiz
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test your students' knowledge with a custom quiz
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Details */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Quiz Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  value={quizData.title}
                  onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="e.g., Module 1 Assessment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={quizData.description}
                  onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                  placeholder="Brief description of the quiz..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={quizData.duration}
                    onChange={(e) => setQuizData({ ...quizData, duration: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={quizData.passingScore}
                    onChange={(e) => setQuizData({ ...quizData, passingScore: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attempt Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quizData.attemptLimit}
                    onChange={(e) => setQuizData({ ...quizData, attemptLimit: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Question {qIndex + 1}
                  </h3>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Question Text *
                    </label>
                    <textarea
                      value={question.questionText}
                      onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                      placeholder="Enter your question..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Options *
                    </label>
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correctAnswer === optIndex}
                            onChange={() => updateQuestion(qIndex, "correctAnswer", optIndex)}
                            className="w-5 h-5 text-green-600 focus:ring-green-500"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                            placeholder={`Option ${optIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      ✓ Select the correct answer
                    </p>
                  </div>

                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Points
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={question.points}
                      onChange={(e) => updateQuestion(qIndex, "points", Number(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Question Button */}
          <button
            type="button"
            onClick={addQuestion}
            className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-4 px-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 transition-all duration-200"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Question
            </span>
          </button>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold py-4 px-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  Creating Quiz...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create Quiz
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
