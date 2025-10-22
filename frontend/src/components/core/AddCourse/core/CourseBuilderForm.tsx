//@ts-nocheck
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "@nextui-org/react";

import NestedView from "./NestedView";
import {
  createSection,
  updateSection,
} from "../../../../services/operations/courseDetailsAPI";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../slices/courseSlice";

// Define types for course and auth states
interface SubSection {
  _id: string;
  title: string;
}

interface Section {
  _id: string;
  sectionName: string;
  subSection: SubSection[];
}

interface Course {
  _id: string;
  courseContent: Section[];
}

interface AuthState {
  token: string;
}

interface RootState {
  course: Course;
  auth: AuthState;
}

type FormValues = {
  sectionName: string;
};

export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [editSectionName, setEditSectionName] = useState<string | null>(null);

  // Handle form submission
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);

    let result;

    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      );
    } else {
      result = await createSection(
        { sectionName: data.sectionName, courseId: course._id },
        token
      );
    }
    if (result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }
    setLoading(false);
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  // Handle edit section name change
  const handleChangeEditSectionName = (
    sectionId: string,
    sectionName: string
  ) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  // Move to the next step
  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add at least one section");
      return;
    }
    if (
      course.courseContent.some((section) => section.subSection.length === 0)
    ) {
      toast.error("Please add at least one lecture in each section");
      return;
    }
    dispatch(setStep(3));
  };

  // Go back to the previous step
  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  return (
    <div className="space-y-8 rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Section Name */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <Input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", {
              required: "Section name is required",
            })}
            className="w-full"
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              {errors.sectionName.message}
            </span>
          )}
        </div>

        {/* Edit Section Name OR Create Section */}
        <div className="flex items-end gap-x-4">
          <Button type="submit" disabled={loading} color="primary">
            {editSectionName ? "Edit Section Name" : "Create Section"}
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </Button>
          {/* if editSectionName mode is on */}
          {editSectionName && (
            <Button type="button" onClick={cancelEdit} color="secondary">
              Cancel Edit
            </Button>
          )}
        </div>
      </form>

      {/* Nested view of section - subSection */}
      {course.courseContent.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      {/* Next Prev Button */}
      <div className="flex justify-end gap-x-3">
        <Button onClick={goBack} color="warning">
          Back
        </Button>

        {/* Next button */}
        <Button disabled={loading} color="primary" onClick={goToNext}>
          Next
          <MdNavigateNext />
        </Button>
      </div>
    </div>
  );
}
