import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  buyCourses,
  fetchCourseDetails,
} from "../services/operations/courseDetailsAPI";
import Curriculum from "../components/course/Curriculum";
import InstructorCard from "../components/course/InstructorCard";
import RatingBreakdown from "../components/course/RatingBreakdown";
import CourseReviews from "../components/course/CourseReviews";
import CourseMeta from "../components/course/CourseMeta";
import CourseOverview from "../components/course/CourseOverview";
import { ArrowLeft, Share2 } from "lucide-react";
import Button from "../components/ui/Button";
import { Course } from "../types";

const CoursePreview: React.FC = () => {
  //@ts-ignore
  const { token } = useSelector((state) => state.auth);
  //@ts-ignore
  const { user } = useSelector((state) => state.profile);
  //@ts-ignore
  const { wishlist, cart } = useSelector((state) => state.profile);

  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const fallbackThumbnail =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='100%' height='100%' fill='#1f2937'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='28' fill='#e5e7eb'>Course Image</text></svg>`
    );

  // Calculate rating breakdown from reviews
  const calculateRatingsBreakdown = (reviews: any[] = []) => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      const rating = Math.round(review.rating);
      if (rating >= 1 && rating <= 5) {
        breakdown[rating as 1 | 2 | 3 | 4 | 5]++;
      }
    });
    return breakdown;
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetchCourseDetails(courseId as string);
        const courseData = res?.data?.data?.courseDetails;
        setCourse(courseData || null);
        setIsInWishlist(
          !!courseData && (wishlist?.some((c: any) => c._id === courseData._id) || false)
        );
      } catch (error) {
        console.error("Error loading course:", error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId, wishlist]);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!course) return;
    // TODO: Dispatch action to add course to cart
    // dispatch(addToCart(course));
    console.log("Adding course to cart:", course);
  };

  const handleWishlistToggle = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!course) return;
    // TODO: Dispatch action to toggle wishlist
    // dispatch(toggleWishlist(course));
    setIsInWishlist(!isInWishlist);
    console.log("Toggling wishlist:", course);
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: course?.courseName || "Check out this course",
        url,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      alert("Course link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Course Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          The course you're looking for doesn't exist.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate("/catalog")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Hero Section with Course Image */}
        <div className="bg-white dark:bg-gray-800 shadow-md mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Course Title */}
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  {course.courseName}
                </h1>

                {/* Course Meta Summary */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                    {course.status || "Published"}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {course.studentsEnrolled?.length || 0} students enrolled
                  </span>
                  {course.averageRating && (
                    <span className="text-gray-600 dark:text-gray-400">
                      ⭐ {course.averageRating.toFixed(1)}
                    </span>
                  )}
                </div>

                {/* Course Thumbnail */}
                <img
                  src={course.thumbnail || fallbackThumbnail}
                  alt={course.courseName}
                  className="w-full h-96 object-cover rounded-lg shadow-md mb-6"
                />

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition mb-6"
                >
                  <Share2 className="w-4 h-4" />
                  Share this course
                </button>
              </div>

              {/* Sticky Meta Card */}
              <div className="lg:col-span-1">
                <CourseMeta
                  price={course.price ?? 0}
                  studentsEnrolled={course.studentsEnrolled?.length || 0}
                  totalDuration={
                    (() => {
                      const minutes = course.courseContent?.reduce((acc: number, section: any) => {
                        return (
                          acc +
                          (section.subSection?.reduce((sum: number, sub: any) => {
                            // Parse duration like "1:30:45" to minutes
                            const parts = (sub.timeDuration || "0:00").split(":");
                            const hours = parseInt(parts[0]) * 60;
                            const mins = parseInt(parts[1]);
                            return sum + hours + mins;
                          }, 0) || 0)
                        );
                      }, 0) || 0;
                      
                      if (minutes === 0) return "0 minutes";
                      const hrs = Math.floor(minutes / 60);
                      const mins = minutes % 60;
                      return `${hrs}h ${mins}m`;
                    })()
                  }
                  totalLessons={
                    course.courseContent?.reduce(
                      (acc: number, section: any) =>
                        acc + (section.subSection?.length || 0),
                      0
                    ) || 0
                  }
                  level={
                    (course.courseLevel as "Beginner" | "Intermediate" | "Advanced" | "All Levels") || "Intermediate"
                  }
                  language={course.language || "English"}
                  certificateIncluded={true}
                  onAddToCart={handleAddToCart}
                  onWishlistToggle={handleWishlistToggle}
                  isInWishlist={isInWishlist}
                  onShare={handleShare}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Course Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview Section */}
              <CourseOverview
                courseDescription={
                  course.courseDescription || "Course content coming soon"
                }
                whatYouWillLearn={
                  Array.isArray(course.whatYouWillLearn)
                    ? course.whatYouWillLearn
                    : course.whatYouWillLearn ? course.whatYouWillLearn.split("\n") : []
                }
                instructions={
                  Array.isArray(course.instructions)
                    ? course.instructions
                    : course.instructions ? course.instructions.split("\n") : []
                }
              />

              {/* Curriculum Section */}
              <Curriculum sections={course.courseContent || []} />

              {/* Instructor Card */}
              {course.instructor && (
                <InstructorCard
                  instructor={
                    typeof course.instructor === "string"
                      ? {
                          firstName: "Instructor",
                          lastName: "Name",
                          email: "instructor@example.com",
                        }
                      : course.instructor
                  }
                  coursesCount={8}
                  studentsCount={45000}
                  rating={4.8}
                />
              )}

              {/* Rating Breakdown */}
              <RatingBreakdown
                ratings={calculateRatingsBreakdown(course.ratingAndReviews)}
                averageRating={course.averageRating || 0}
                totalReviews={course.ratingAndReviews?.length || 0}
              />

              {/* Reviews Section */}
              <CourseReviews
                reviews={
                  course.ratingAndReviews?.map((review: any) => ({
                    _id: review._id,
                    userId:
                      typeof (review.user || review.userId) === "string" ||
                      !(review.user || review.userId)
                        ? {
                            firstName: "Anonymous",
                            lastName: "User",
                            image: "",
                          }
                        : (review.user || review.userId),
                    rating: review.rating,
                    review: review.review,
                    createdAt: review.createdAt || new Date().toISOString(),
                  })) || []
                }
                totalReviews={course.ratingAndReviews?.length || 0}
              />
            </div>

            {/* Right Column - Sticky Meta (Mobile Hidden) */}
            <div className="hidden lg:block">
              {/* Duplicate for mobile responsiveness */}
            </div>
          </div>
        </div>
      </div>
  );
};

export default CoursePreview;
