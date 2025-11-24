import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BookOpen, TrendingUp, Filter, Search } from "lucide-react";
import { CourseProgress } from "../types";
import { ProgressCard, ProgressStats } from "../components/progress";
import { getUserEnrolledCourses } from "../services/operations/profileAPI";
import { useToast } from "../context/ToastContext";
import Button from "../components/ui/Button";

const StudentProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: any) => state.auth);
  const { error } = useToast();
  const [progressData, setProgressData] = useState<CourseProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (token) {
      fetchProgressData();
    }
  }, [token]);

  const fetchProgressData = async () => {
    try {
      setIsLoading(true);
      const response = await getUserEnrolledCourses(token);

      // Response is directly an array of courses, not {success, courses}
      if (response && Array.isArray(response) && response.length > 0) {
        // Transform enrolled courses to progress data
        const progressList: CourseProgress[] = response.map((course: any) => ({
          _id: course._id,
          userId: course._id, // Using course ID since we don't have explicit userId
          courseId: course._id,
          completedVideos: [],
          completedQuizzes: [],
          progressPercentage: 0,
          updatedAt: new Date().toISOString(),
          courseName: course.courseName,
          thumbnail: course.thumbnail,
          instructor: course.instructor,
        }));
        
        setProgressData(progressList);
      } else {
        console.log("No courses found or invalid response");
        setProgressData([]);
      }
    } catch (err: any) {
      console.error("Error fetching progress data:", err);
      error("Failed to Load Progress", "Could not fetch your enrolled courses");
      setProgressData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter progress data
  const filteredProgress = progressData.filter((progress) => {
    // Filter by status
    if (filter === "completed" && progress.progressPercentage < 100) return false;
    if (filter === "in-progress" && (progress.progressPercentage === 0 || progress.progressPercentage >= 100))
      return false;

    // Filter by search query (would need course data)
    if (searchQuery) {
      // TODO: Implement search once course data is populated
      return true;
    }

    return true;
  });

  // Calculate stats
  const totalCourses = progressData.length;
  const completedCourses = progressData.filter((p) => p.progressPercentage >= 100).length;
  const inProgressCourses = progressData.filter(
    (p) => p.progressPercentage > 0 && p.progressPercentage < 100
  ).length;
  const totalCertificates = progressData.filter((p) => p.certificateId).length;
  const averageProgress =
    totalCourses > 0
      ? progressData.reduce((sum, p) => sum + p.progressPercentage, 0) / totalCourses
      : 0;

  // Mock learning hours calculation (would come from backend)
  const totalLearningHours = Math.round(completedCourses * 8.5 + inProgressCourses * 4.2);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                My Learning Progress
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Track your progress and achievements across all enrolled courses
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <ProgressStats
          totalCourses={totalCourses}
          completedCourses={completedCourses}
          inProgressCourses={inProgressCourses}
          totalCertificates={totalCertificates}
          totalLearningHours={totalLearningHours}
          averageProgress={averageProgress}
          className="mb-8"
        />

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "all"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  All ({totalCourses})
                </button>
                <button
                  onClick={() => setFilter("in-progress")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "in-progress"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  In Progress ({inProgressCourses})
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "completed"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Completed ({completedCourses})
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Progress Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProgress.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProgress.map((progress) => (
              <ProgressCard key={progress._id} progress={progress} />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {filter === "all"
                ? "No Courses Yet"
                : filter === "completed"
                ? "No Completed Courses"
                : "No Courses In Progress"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === "all"
                ? "Start your learning journey by enrolling in a course"
                : filter === "completed"
                ? "Complete a course to see it here"
                : "Start learning to see your progress"}
            </p>
            <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgressPage;
