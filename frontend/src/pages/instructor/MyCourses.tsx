//@ts-nocheck
import { useEffect, useState } from "react";
import { VscAdd } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../services/operations/courseDetailsAPI";
import { Button, Card, CardBody, CardHeader, Image } from "@nextui-org/react";

export default function MyCourses() {
  //@ts-ignore
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const result = await fetchInstructorCourses(token);

      setLoading(false);
      if (result) {
        setCourses(result);
        console.log(result);
      }
    };
    fetchCourses();
  }, []);

  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-8">
      <div className="mb-14 flex justify-between">
        {/* <div className="mb-14 flex items-center justify-between"> */}
        <h1 className="text-4xl font-medium text-richblack-5  text-center lg:text-left">
          My Courses
        </h1>
        <Button
          onClick={() => navigate("/dashboard/add-course")}
          color="primary"
        >
          Add Course <VscAdd />
        </Button>
      </div>

      <Card className="py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">Courses</h4>
        </CardHeader>
        {courses.map((course) => (
          <CardBody
            key={course._id}
            className="overflow-visible py-2 flex flex-row gap-5 mb-4 justify-between"
          >
            <Image
              alt={`Thumbnail of ${course.courseName}`}
              className="object-cover rounded-xl"
              src={course.thumbnail}
              width={270}
            />
            <div>
              <h2 className="font-bold">{course.courseName}</h2>
              <p>{course.courseDescription}</p>

              <p className="mb-6">{course.status}</p>
              <span>{course.whatYouWillLearn}</span>
            </div>
            <Button
              onClick={() => {
                deleteCourse(course._id, token);
              }}
              color="primary"
            >
              Delete Course
            </Button>
          </CardBody>
        ))}
      </Card>
    </div>
  );
}
