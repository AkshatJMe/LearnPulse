//@ts-nocheck
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { editCourseDetails } from "../../../../services/operations/courseDetailsAPI";
import { resetCourseState, setStep } from "../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../utils/constant";
import { Button } from "@nextui-org/react";

// Define types for form values
interface FormValues {
  public: boolean;
}

// Define types for the Redux state
interface AuthState {
  token: string;
}

interface CourseState {
  _id: string;
  status: string;
}

interface RootState {
  auth: AuthState;
  course: CourseState;
}

export default function PublishCourse() {
  const { register, handleSubmit, setValue, getValues } = useForm<FormValues>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //@ts-ignore
  const { token } = useSelector((state) => state.auth);
  //@ts-ignore
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true);
    }
  }, [course?.status, setValue]);

  const goBack = () => {
    dispatch(setStep(2));
  };

  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/instructor");
  };

  const handleCoursePublish = async () => {
    // Check if form has been updated or not
    if (
      (course?.status === COURSE_STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      // Form has not been updated; no need to make API call
      goToCourses();
      return;
    }

    const formData = new FormData();
    formData.append("courseId", course._id);
    const courseStatus = getValues("public")
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT;
    formData.append("status", courseStatus);

    setLoading(true);
    const result = await editCourseDetails(formData, token);
    if (result) {
      goToCourses();
    }
    setLoading(false);
  };

  const onSubmit: SubmitHandler<FormValues> = () => {
    handleCoursePublish();
  };

  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">
        Publish Settings
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Checkbox */}
        <div className="my-6 mb-8">
          <label htmlFor="public" className="inline-flex items-center text-lg">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
            />
            <span className="ml-2 text-richblack-400">
              Make this course public
            </span>
          </label>
        </div>

        {/* Next Prev Button */}
        <div className="ml-auto flex max-w-max items-center gap-x-4">
          <Button disabled={loading} onClick={goBack} color="danger">
            Back
          </Button>
          <Button
            disabled={loading}
            onClick={handleCoursePublish}
            color="primary"
          >
            Save Change
          </Button>
        </div>
      </form>
    </div>
  );
}
