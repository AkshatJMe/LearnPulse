import { apiConnector } from "../apiConnector";
import { adminEndPoints } from "./../apis";
const {
  GET_ALL_STUDENTS_DATA_API,
  GET_ALL_INSTRUCTORS_DATA_API,
  GET_PLATFORM_ANALYTICS_API,
  GET_PENDING_COURSES_API,
  APPROVE_COURSE_API,
  REJECT_COURSE_API,
  DISABLE_COURSE_API,
  GET_ALL_USERS_API,
  TOGGLE_USER_STATUS_API,
  REMOVE_REVIEW_API,
  ADMIN_DELETE_COURSE_API,
  DELETE_USER_API,
} = adminEndPoints;

export async function getAllStudentsData(token: string) {
  let result = [];
  try {
    const response = await apiConnector({
      method: "GET",
      url: GET_ALL_STUDENTS_DATA_API,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    result = response?.data;

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  } catch (error) {}
  return result;
}

export async function getAllInstructorDetails(token: string) {
  let result = [];
  try {
    const response = await apiConnector({
      method: "GET",
      url: GET_ALL_INSTRUCTORS_DATA_API,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    result = response?.data;

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  } catch (error) {}
  return result;
}

export async function getPlatformAnalytics(token: string) {
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "GET",
      url: GET_PLATFORM_ANALYTICS_API,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.success) {
      const analytics = response?.data?.analytics;

      const monthlyArray = Array.isArray(analytics?.revenue?.monthly)
        ? analytics.revenue.monthly
        : [];
      const dailyArray = Array.isArray(analytics?.revenue?.daily)
        ? analytics.revenue.daily
        : [];

      const monthlyFromArray = monthlyArray.reduce(
        (sum: number, item: any) => sum + (Number(item?.revenue) || 0),
        0
      );
      const dailyFromArray = dailyArray.reduce(
        (sum: number, item: any) => sum + (Number(item?.revenue) || 0),
        0
      );

      // Transform nested structure to flat structure
      result = {
        totalUsers: analytics?.users?.total || 0,
        totalStudents: analytics?.users?.students || 0,
        totalInstructors: analytics?.users?.instructors || 0,
        activeInstructors: analytics?.users?.activeInstructors || 0,
        totalCourses: analytics?.courses?.total || 0,
        totalPublishedCourses: analytics?.courses?.published || 0,
        totalPendingCourses: analytics?.courses?.pending || 0,
        totalRevenue: analytics?.revenue?.total || 0,
        monthlyRevenue:
          Number(analytics?.revenue?.monthlyCurrent) || monthlyFromArray || 0,
        dailyRevenue:
          Number(analytics?.revenue?.dailyCurrent) || dailyFromArray || 0,
        topCourses: analytics?.topCourses || [],
      };
    } else {
      throw new Error(response?.data?.message || "Failed to fetch analytics");
    }
  } catch (error) {
    console.error("Analytics Error:", error);
  }
  return result;
}

export async function getPendingCourses(token: string) {
  let result: any[] = [];
  try {
    const response = await apiConnector({
      method: "GET",
      url: GET_PENDING_COURSES_API,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.success) {
      result = response?.data?.data || [];
    } else {
      throw new Error(response?.data?.message || "Failed to fetch pending courses");
    }
  } catch (error) {
    console.error("Pending Courses Error:", error);
  }
  return result;
}

export async function approveCourse(courseId: string, token: string) {
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "PUT",
      url: `${APPROVE_COURSE_API}/${courseId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.success) {
      result = response?.data?.data;
    } else {
      throw new Error(response?.data?.message || "Failed to approve course");
    }
  } catch (error) {
    console.error("Approve Course Error:", error);
    throw error;
  }
  return result;
}

export async function rejectCourse(
  courseId: string,
  rejectionReason: string,
  token: string
) {
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "PUT",
      url: `${REJECT_COURSE_API}/${courseId}`,
      bodyData: {
        rejectionReason,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.success) {
      result = response?.data?.data;
    } else {
      throw new Error(response?.data?.message || "Failed to reject course");
    }
  } catch (error) {
    console.error("Reject Course Error:", error);
    throw error;
  }
  return result;
}

export async function disableCourse(courseId: string, token: string) {
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "PUT",
      url: `${DISABLE_COURSE_API}/${courseId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.success) {
      result = response?.data?.data;
    } else {
      throw new Error(response?.data?.message || "Failed to disable course");
    }
  } catch (error) {
    console.error("Disable Course Error:", error);
    throw error;
  }
  return result;
}

export async function getAllUsers(token: string) {
  let result: any[] = [];
  try {
    const response = await apiConnector({
      method: "GET",
      url: GET_ALL_USERS_API,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.success) {
      result = response?.data?.users || [];
    } else {
      throw new Error(response?.data?.message || "Failed to fetch users");
    }
  } catch (error) {
    console.error("Get All Users Error:", error);
  }
  return result;
}

export async function toggleUserStatus(userId: string, token: string) {
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "PUT",
      url: `${TOGGLE_USER_STATUS_API}/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.success) {
      result = response?.data?.data;
    } else {
      throw new Error(response?.data?.message || "Failed to toggle user status");
    }
  } catch (error) {
    console.error("Toggle User Status Error:", error);
    throw error;
  }
  return result;
}

export async function removeReview(reviewId: string, token: string) {
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "DELETE",
      url: `${REMOVE_REVIEW_API}/${reviewId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.success) {
      result = response?.data?.data;
    } else {
      throw new Error(response?.data?.message || "Failed to remove review");
    }
  } catch (error) {
    console.error("Remove Review Error:", error);
    throw error;
  }
  return result;
}

export async function deleteCourse(courseId: string, token: string) {
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "DELETE",
      url: `${ADMIN_DELETE_COURSE_API}/${courseId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.success) {
      result = response?.data?.data;
    } else {
      throw new Error(response?.data?.message || "Failed to delete course");
    }
  } catch (error) {
    console.error("Delete Course Error:", error);
    throw error;
  }
  return result;
}

export async function deleteUser(userId: string, token: string) {
  let result: any = null;
  try {
    const response = await apiConnector({
      method: "DELETE",
      url: `${DELETE_USER_API}/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.success) {
      result = response?.data?.data;
    } else {
      throw new Error(response?.data?.message || "Failed to delete user");
    }
  } catch (error) {
    console.error("Delete User Error:", error);
    throw error;
  }
  return result;
}
