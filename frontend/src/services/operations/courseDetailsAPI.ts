import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { courseEndpoints } from "../apis";

const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  COURSE_CATEGORIES_TYPE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
  CREATE_NEW_CATEGORY,
  DELETE_CATEGORY,
  BUY_COURSE,
} = courseEndpoints;

export const createNewCategory = async function (
  name: string,
  description: string,
  token: string
) {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector({
      method: "POST",
      url: CREATE_NEW_CATEGORY,
      bodyData: { name, description },
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response?.data?.success) {
      console.log("Could Not create new category");
    }

    toast.success("New Category Created !");
  } catch (error) {
    toast.error("Category not created");
  }
  toast.dismiss(toastId);
};

export const deleteCategory = async (categoryId: string, token: string) => {
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector({
      method: "DELETE",
      url: DELETE_CATEGORY,
      bodyData: { categoryId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response?.data?.success) {
      console.log("Could Not delete category");
    }

    toast.success("Category Deleted !");
  } catch (error) {
    toast.error("Error in deleting course");
  }
  toast.dismiss(toastId);
};

export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...");
  let result = [];

  try {
    const response = await apiConnector({
      method: "GET",
      url: GET_ALL_COURSE_API,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    result = response?.data?.data;
  } catch (error) {
    toast.error("Error in fetching course category");
  }
  toast.dismiss(toastId);
  return result;
};

export async function buyCourses(token: string, courseId: string) {
  try {
    const response = await apiConnector({
      method: "POST",
      url: BUY_COURSE,
      bodyData: { courseId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Here", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  } catch (error) {}
  return;
}

export const fetchCourseDetails = async (courseId: string) => {
  let result: any;
  try {
    const response = await apiConnector({
      method: "POST",
      url: COURSE_DETAILS_API,
      bodyData: { courseId },
    });

    if (!response?.data?.success) {
      console.log("Could Not fetch course details");
    }
    result = response;
  } catch (error) {
    toast.error("Error in getting course data");
  }
  return result;
};

export const fetchCoursesByCategory = async (category: string) => {
  let result: any;

  console.log(category);

  try {
    const response = await apiConnector({
      method: "POST",
      url: COURSE_CATEGORIES_TYPE_API,
      bodyData: { category },
    });

    if (!response?.data?.success) {
      console.log("Could Not fetch course details");
    }
    result = response.data;
  } catch (error) {
    toast.error("Error in getting course data");
  }
  return result;
};

export const fetchCourseCategories = async () => {
  let result = [];

  try {
    const response = await apiConnector({
      method: "GET",
      url: COURSE_CATEGORIES_API,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    result = response?.data?.data;
  } catch (error) {
    toast.error("Error in fetching course category");
  }
  return result;
};

export const addCourseDetails = async function (data: any, token: string) {
  const toastId = toast.loading("Loading...");
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "POST",
      url: CREATE_COURSE_API,
      bodyData: data,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    result = response?.data?.data;
    toast.success("Course Details Added Successfully");
  } catch (error) {}
  toast.dismiss(toastId);
  return result;
};

export const editCourseDetails = async function (data: any, token: string) {
  const toastId = toast.loading("Loading...");
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "POST",
      url: EDIT_COURSE_API,
      bodyData: data,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to update course");
    }

    result = response?.data?.data;
    toast.success("Course Details Updated Successfully");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to update course");
  }
  toast.dismiss(toastId);
  return result;
};

export const createSection = async function (data: any, token: string) {
  const toastId = toast.loading("Loading...");
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "POST",
      url: CREATE_SECTION_API,
      bodyData: data,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to create section");
    }

    result = response?.data?.data || response?.data?.updatedCourseDetails;
    toast.success("Course Section Created");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to create section");
  }
  toast.dismiss(toastId);
  return result;
};

export const createSubSection = async function (data: any, token: string) {
  const toastId = toast.loading("Loading...");
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "POST",
      url: CREATE_SUBSECTION_API,
      bodyData: data,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    result = response?.data?.data;
    toast.success("Lecture Added");
  } catch (error) {}
  toast.dismiss(toastId);
  return result;
};

export const updateSection = async function (data: any, token: string) {
  const toastId = toast.loading("Loading...");
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "POST",
      url: UPDATE_SECTION_API,
      bodyData: data,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to update section");
    }

    result = response?.data?.data;
    toast.success("Course Section Updated");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to update section");
  }
  toast.dismiss(toastId);
  return result;
};

export const updateSubSection = async function (data: any, token: string) {
  const toastId = toast.loading("Loading...");
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "POST",
      url: UPDATE_SUBSECTION_API,
      bodyData: data,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to update lecture");
    }

    result = response?.data?.data;
    toast.success("Lecture Updated");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to update lecture");
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSection = async function (data: any, token: string) {
  const toastId = toast.loading("Loading...");
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "POST",
      url: DELETE_SECTION_API,
      bodyData: data,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to delete section");
    }

    result = response?.data?.data;
    toast.success("Course Section Deleted");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to delete section");
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSubSection = async function (data: any, token: string) {
  const toastId = toast.loading("Loading...");
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "POST",
      url: DELETE_SUBSECTION_API,
      bodyData: data,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to delete lecture");
    }

    result = response?.data?.data;
    toast.success("Lecture Deleted");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to delete lecture");
  }
  toast.dismiss(toastId);
  return result;
};

export const fetchInstructorCourses = async (token: string) => {
  let result = [];

  try {
    const response = await apiConnector({
      method: "GET",
      url: GET_ALL_INSTRUCTOR_COURSES_API,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    result = response?.data?.data;
  } catch (error) {
    toast.error("Error in fetching course category");
  }
  return result;
};

export const deleteCourse = async function (courseId: string, token: string) {
  try {
    const response = await apiConnector({
      method: "DELETE",
      url: DELETE_COURSE_API + `/${courseId}`,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course");
    }
    toast.success("Course Deleted");
  } catch (error) {}
};

export const getFullDetailsOfCourse = async (
  courseId: string,
  token: string
) => {
  let result: any = null;

  try {
    const response = await apiConnector({
      method: "POST",
      url: GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      bodyData: courseId,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response?.data?.success) {
      console.log("Could Not delete category");
    }

    result = response?.data?.data;
  } catch (error) {}
  return result;
};

export const markLectureAsComplete = async function (data: any, token: string) {
  let result: any = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector({
      method: "POST",
      url: LECTURE_COMPLETION_API,
      bodyData: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    result = response?.data?.data;
    toast.success("Lecture Completed");
    result = true;
  } catch (error) {}
  toast.dismiss(toastId);
  return result;
};

export const createRating = async function (data: any, token: string) {
  let success: boolean = false;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector({
      method: "POST",
      url: CREATE_RATING_API,
      bodyData: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Create Rating");
    }
    toast.success("Rating Created");
    success = true;
  } catch (error) {
    success = false;
  }
  toast.dismiss(toastId);
  return success;
};
