// @ts-nocheck
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserEnrolledCourses } from "../../services/operations/profileAPI";
import { X, BookOpen, ArrowRight } from "lucide-react";

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Initialize as null to distinguish between "Loading" and "Empty"
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);
      setEnrolledCourses(res || []);
    } catch (error) {
      console.log("Could not fetch enrolled courses.");
      setEnrolledCourses([]); // Fallback to empty array on error
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  return (
    <div className="w-full min-h-screen bg-background py-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          My Enrolled Courses
        </h1>

        {/* 1. LOADING STATE */}
        {enrolledCourses === null ? (
          <div className="flex flex-col items-center justify-center h-[40vh] gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-default-500 animate-pulse">
              Fetching your courses...
            </p>
          </div>
        ) : /* 2. EMPTY STATE - User has 0 courses */
        enrolledCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 bg-default-50 rounded-2xl border-2 border-dashed border-default-200">
            <div className="bg-primary/10 p-5 rounded-full mb-6">
              <BookOpen size={48} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              You haven't enrolled in any courses yet
            </h2>
            <p className="text-default-500 mt-2 text-center max-w-md">
              Explore our catalog to find the perfect course for your career
              goals. Start your learning journey today!
            </p>
            <button
              onClick={() => navigate("/catalog")}
              className="mt-8 flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30"
            >
              Browse Catalog <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          /* 3. GRID VIEW - User has courses */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {enrolledCourses.map((course) => (
              <div
                key={course._id}
                onClick={() => setSelectedCourse(course)}
                className="group cursor-pointer bg-card rounded-xl overflow-hidden border border-default-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </div>

                <div className="p-4 flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <span className="text-primary font-bold text-xs">
                      {course.courseName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <h3 className="font-bold text-base text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {course.courseName}
                    </h3>
                    <p className="text-sm text-default-500 mt-1">
                      Instructor • {course.instructor?.firstName || "Expert"}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-primary">
                        ₹{course.price}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-success/10 text-success rounded">
                        Enrolled
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================= */}
      {/* 🔥 Course Preview Modal */}
      {/* ========================= */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-6">
          <div className="bg-white max-w-4xl w-full rounded-2xl overflow-y-auto max-h-[90vh] relative shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-600 hover:text-black hover:bg-white transition-all shadow-md"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col lg:flex-row h-full">
              {/* Left Side: Thumbnail */}
              <div className="lg:w-1/2 h-full">
                <img
                  src={selectedCourse.thumbnail}
                  alt={selectedCourse.courseName}
                  className="w-full h-full object-cover min-h-[250px]"
                />
              </div>

              {/* Right Side: Content */}
              <div className="lg:w-1/2 p-8 overflow-y-auto">
                <h2 className="text-3xl font-black text-gray-900 leading-tight">
                  {selectedCourse.courseName}
                </h2>

                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-sm uppercase tracking-widest font-bold text-primary mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedCourse.courseDescription}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm uppercase tracking-widest font-bold text-primary mb-2">
                      What you will learn
                    </h3>
                    <ul className="grid grid-cols-1 gap-2">
                      {selectedCourse.whatYouWillLearn
                        ?.split("\r\n")
                        .map((point, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-gray-700 text-sm italic"
                          >
                            <span className="text-success font-bold">✓</span>{" "}
                            {point}
                          </li>
                        ))}
                    </ul>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/view-course/${selectedCourse._id}`)
                    }
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
