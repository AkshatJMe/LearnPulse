import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchCoursesByCategory } from "../services/operations/courseDetailsAPI";

type Instructor = {
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};

type Course = {
  _id: string;
  courseName: string;
  courseDescription: string;
  price: number;
  thumbnail: string;
  instructor: Instructor;
  ratingAndReviews: number;
  studentsEnrolled: number;
};

const CategoryType: React.FC = () => {
  const { id } = useParams(); // e.g. "android-development"
  const navigate = useNavigate();

  //@ts-ignore
  const { token } = useSelector((state) => state.auth);
  //@ts-ignore
  const { user } = useSelector((state) => state.profile);

  const [categoryName, setCategoryName] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const formatCategorySlug = (slug: string): string => {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        const formattedName = formatCategorySlug(id);
        setCategoryName(formattedName);

        const response = await fetchCoursesByCategory(formattedName);
        const courseList = response?.data || [];
        setCourses(courseList);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCourseClick = (courseId: string) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Courses in category:{" "}
        <span className="text-blue-600">{categoryName}</span>
      </h2>

      {courses.length === 0 ? (
        <p className="text-gray-600">No courses found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => handleCourseClick(course._id)}
              className="cursor-pointer border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-bold">{course.courseName}</h3>
              <p className="text-sm text-gray-700 mb-2">
                {course.courseDescription.slice(0, 100)}...
              </p>
              <p className="text-gray-600 text-sm">
                Instructor: {course.instructor.firstName}{" "}
                {course.instructor.lastName}
              </p>
              <p className="text-blue-700 font-semibold mt-2">
                ₹{course.price}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryType;
