import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, BookOpen, Award, Clock, TrendingUp } from "lucide-react";
import { CourseProgress, Course } from "../types";
import { ProgressBar, ProgressTimeline } from "../components/progress";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import { useToast } from "../context/ToastContext";
import Button from "../components/ui/Button";

interface TimelineItem {
  id: string;
  title: string;
  type: "video" | "quiz" | "section";
  status: "completed" | "in-progress" | "locked";
  completedAt?: string;
  duration?: string;
}

const CourseProgressDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { token } = useSelector((state: any) => state.auth);
  const { error } = useToast();
  
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (courseId && token) {
      fetchProgressDetail(courseId);
    }
  }, [courseId, token]);

  const fetchProgressDetail = async (cId: string) => {
    try {
      setIsLoading(true);
      const response = await fetchCourseDetails(cId);
      
      if (response?.data?.success && response?.data?.data) {
        const courseData = response.data.data;
        setCourse(courseData);
        
        // Build timeline from course content
        const timeline: TimelineItem[] = [];
        if (courseData.courseContent && Array.isArray(courseData.courseContent)) {
          courseData.courseContent.forEach((section: any) => {
            timeline.push({
              id: section._id,
              title: section.sectionName,
              type: "section",
              status: "in-progress",
            });
            
            if (section.subSection && Array.isArray(section.subSection)) {
              section.subSection.forEach((subSection: any) => {
                timeline.push({
                  id: subSection._id,
                  title: subSection.title,
                  type: "video",
                  status: "in-progress",
                  duration: "15-20 min",
                });
              });
            }
          });
        }
        setTimelineItems(timeline);
        
        // Set progress with enrolled course data
        setProgress({
          _id: "",
          userId: "",
          courseId: cId,
          completedVideos: [],
          completedQuizzes: [],
          progressPercentage: 0,
          updatedAt: new Date().toISOString(),
        });
      } else {
        error("Course Not Found", "Could not load course details");
      }
    } catch (err: any) {
      console.error("Error fetching progress detail:", err);
      error("Failed to Load Course", err.message || "Could not fetch course details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (item: TimelineItem) => {
    if (item.status !== "locked") {
      // Navigate to the lesson/quiz
      navigate(`/course/${courseId}/lesson/${item.id}`);
    }
  };

  const handleContinueLearning = () => {
    // Find the first incomplete lesson
    const nextLesson = timelineItems.find(
      (item) => item.status === "in-progress" || (item.status !== "completed" && item.status !== "locked")
    );
    if (nextLesson) {
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
    }
  };

  const handleViewCertificate = () => {
    if (progress?.certificateId) {
      navigate(`/certificate/${progress.certificateId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!progress || !course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This course progress could not be found.
          </p>
          <Button onClick={() => navigate("/dashboard/progress")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Progress
          </Button>
        </div>
      </div>
    );
  }

  const isCompleted = progress.progressPercentage >= 100;
  const completedVideos = progress.completedVideos?.length || 0;
  const completedQuizzes = progress.completedQuizzes?.length || 0;
  const totalLessons = timelineItems.filter((item) => item.type === "video").length;
  const totalQuizzes = timelineItems.filter((item) => item.type === "quiz").length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate("/dashboard/progress")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Progress
          </button>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Course Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {course.courseName}
              </h1>
              {typeof course.instructor === "object" && (
                <p className="text-gray-600 dark:text-gray-400">
                  by {course.instructor.firstName} {course.instructor.lastName}
                </p>
              )}
            </div>

            {/* Progress Circle */}
            <div className="flex items-center justify-center lg:justify-end">
              <ProgressBar percentage={progress.progressPercentage} size="lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-500 p-2 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {completedVideos}/{totalLessons}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Lessons</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-500 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {completedQuizzes}/{totalQuizzes}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Quizzes</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 dark:bg-green-900/30 text-green-500 p-2 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {progress.updatedAt
                    ? new Date(progress.updatedAt).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Last Accessed</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-500 p-2 rounded-lg">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isCompleted ? "Yes" : "No"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Certificate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          {isCompleted && progress.certificateId ? (
            <Button onClick={handleViewCertificate} variant="secondary" className="flex-1 sm:flex-none">
              <Award className="w-4 h-4 mr-2" />
              View Certificate
            </Button>
          ) : (
            <Button onClick={handleContinueLearning} className="flex-1 sm:flex-none">
              Continue Learning
            </Button>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Course Timeline
          </h2>
          <ProgressTimeline items={timelineItems} onItemClick={handleItemClick} />
        </div>
      </div>
    </div>
  );
};

export default CourseProgressDetailPage;
