// @ts-nocheck
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../services/operations/profileAPI";
import { X } from "lucide-react"; // For close icon

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);
      setEnrolledCourses(res);
    } catch (error) {
      console.log("Could not fetch enrolled courses.");
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  return (
    <div className="w-full min-h-screen bg-background py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        {enrolledCourses.map((course) => (
          <div
            key={course._id}
            onClick={() => setSelectedCourse(course)}
            className="cursor-pointer group transition-transform duration-200 hover:scale-[1.03]"
          >
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md">
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex mt-3 gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-300 shrink-0" />
              <div className="flex flex-col text-foreground">
                <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {course.courseName}
                </h3>
                <p className="text-sm text-default-500">Instructor</p>
                <p className="text-xs text-default-400 mt-0.5">
                  ₹{course.price}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================= */}
      {/* 🔥 Course Preview Modal */}
      {/* ========================= */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-white max-w-4xl w-full rounded-lg overflow-y-auto max-h-[90vh] relative p-6 shadow-xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <X size={24} />
            </button>

            {/* Course Preview */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Thumbnail */}
              <div className="lg:w-1/2">
                <img
                  src={selectedCourse.thumbnail}
                  alt={selectedCourse.courseName}
                  className="rounded-lg w-full object-cover"
                />
              </div>

              {/* Course Info */}
              <div className="lg:w-1/2 flex flex-col gap-3">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCourse.courseName}
                </h2>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {selectedCourse.courseDescription}
                </p>

                <div>
                  <h3 className="font-semibold mt-4 text-gray-800">
                    What you will learn:
                  </h3>
                  <ul className="list-disc pl-4 text-sm text-gray-700 mt-1 whitespace-pre-line">
                    {selectedCourse.whatYouWillLearn
                      .split("\r\n")
                      .map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                  </ul>
                </div>

                {selectedCourse.instructions?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mt-4 text-gray-800">
                      Prerequisites:
                    </h3>
                    <ul className="list-disc pl-4 text-sm text-gray-700 mt-1">
                      {selectedCourse.instructions.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 text-lg font-semibold text-green-600">
                  Course Preview
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
