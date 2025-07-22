import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  buyCourses,
  fetchCourseDetails,
} from "../services/operations/courseDetailsAPI";
import { Button } from "@nextui-org/react";

type Instructor = {
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
};

type CourseContent = {
  sectionName: string;
  subSection: { title: string; duration: string }[];
};

type CourseDetails = {
  _id: string;
  courseName: string;
  courseDescription: string;
  price: number;
  thumbnail: string;
  instructor: Instructor;
  studentsEnrolled: any[];
  whatYouWillLearn: string;
  courseContent: CourseContent[];
  instructions: string[];
  totalDuration: string;
};

const CoursePreview: React.FC = () => {
  //@ts-ignore
  const { token } = useSelector((state) => state.auth);
  //@ts-ignore
  const { user } = useSelector((state) => state.profile);

  const { courseId } = useParams<{ courseId: string }>();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const handleBuyNow = () => {
    setShowPaymentModal(true);
  };

  const handleCompletePurchase = () => {
    // Simulate successful purchase
    //@ts-ignore
    buyCourses(token, courseId);
    alert(`You have purchased: ${course?.courseName}`);
    setShowPaymentModal(false);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchCourse = async () => {
      try {
        const res = await fetchCourseDetails(courseId as string);
        const courseData = res?.data?.data?.courseDetails;
        const totalDuration = res?.data?.data?.totalDuration;

        setCourse({
          ...courseData,
          totalDuration,
        });
      } catch (error) {
        console.error("Error loading course:", error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId, user, navigate]);

  if (loading) return <div className="p-6">Loading course...</div>;
  if (!course) return <div className="p-6">Course not found.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{course.courseName}</h1>
      <img
        src={course.thumbnail}
        alt={course.courseName}
        className="w-full max-h-[400px] object-cover rounded mb-4"
      />
      <p className="text-lg text-gray-700 mb-4">{course.courseDescription}</p>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">What You'll Learn</h2>
        <ul className="list-disc pl-6 text-gray-700">
          {course.whatYouWillLearn.split("\r\n").map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Instructions</h2>
        <ul className="list-disc pl-6 text-gray-600">
          {course.instructions.map((inst, idx) => (
            <li key={idx}>{inst}</li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Course Content</h2>
        <p className="text-gray-600 mb-2">
          Total Duration: <strong>{course.totalDuration}</strong>
        </p>
        {course.courseContent.length === 0 ? (
          <p className="text-gray-500">No modules added yet.</p>
        ) : (
          course.courseContent.map((section, idx) => (
            <div key={idx} className="mb-4">
              <h3 className="font-semibold">{section.sectionName}</h3>
              <ul className="ml-4 text-sm text-gray-600 list-disc">
                {section.subSection.map((sub, i) => (
                  <li key={i}>
                    {sub.title} ({sub.duration})
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Instructor</h2>
        <div className="flex items-center gap-4">
          <img
            src={
              course.instructor.image ||
              "https://via.placeholder.com/48?text=User"
            }
            alt={course.instructor.firstName}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-medium">
              {course.instructor.firstName} {course.instructor.lastName}
            </p>
            <p className="text-sm text-gray-500">{course.instructor.email}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">Price</h2>
          <p className="text-blue-700 text-2xl font-bold">₹{course.price}</p>
        </div>

        {user && user?.accountType === "student" && (
          <Button color="primary" className="mt-4" onClick={handleBuyNow}>
            Buy Now
          </Button>
        )}
      </div>
      {/* Show Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Card Payment</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Card Number"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="CVV"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Card Holder Name"
                className="w-full border rounded px-3 py-2"
              />
              <Button
                color="success"
                onClick={handleCompletePurchase}
                className="w-full"
              >
                Complete Payment
              </Button>
              <Button
                color="danger"
                onClick={() => setShowPaymentModal(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePreview;
