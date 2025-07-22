const SERVER_URL = import.meta.env.VITE_SERVER_URL + "/api/v1";

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: SERVER_URL + "/auth/sendotp",
  SIGNUP_API: SERVER_URL + "/auth/signup",
  LOGIN_API: SERVER_URL + "/auth/login",
  RESETPASSTOKEN_API: SERVER_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: SERVER_URL + "/auth/reset-password",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: SERVER_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: SERVER_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: SERVER_URL + "/profile/instructorDashboard",
};

// ADMIN ENDPOINTS
export const adminEndPoints = {
  GET_ALL_STUDENTS_DATA_API: SERVER_URL + "/profile/allStudents",
  GET_ALL_INSTRUCTORS_DATA_API: SERVER_URL + "/profile/allInstructors",
};

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: SERVER_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: SERVER_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API:
    SERVER_URL + "/payment/sendPaymentSuccessEmail",
};

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: SERVER_URL + "/course/getAllCourses",
  COURSE_DETAILS_API: SERVER_URL + "/course/getCourseDetails",
  EDIT_COURSE_API: SERVER_URL + "/course/editCourse",
  COURSE_CATEGORIES_API: SERVER_URL + "/course/showAllCategories",
  COURSE_CATEGORIES_TYPE_API: SERVER_URL + "/course/getAllCoursesByCategory",
  CREATE_COURSE_API: SERVER_URL + "/course/createCourse",
  CREATE_SECTION_API: SERVER_URL + "/course/addSection",
  CREATE_SUBSECTION_API: SERVER_URL + "/course/addSubSection",
  UPDATE_SECTION_API: SERVER_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: SERVER_URL + "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: SERVER_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: SERVER_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: SERVER_URL + "/course/deleteSubSection",
  DELETE_COURSE_API: SERVER_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    SERVER_URL + "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: SERVER_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: SERVER_URL + "/course/createRating",
  CREATE_NEW_CATEGORY: SERVER_URL + "/course/createCategory",
  DELETE_CATEGORY: SERVER_URL + "/course/deleteCategory",
  BUY_COURSE: SERVER_URL + "/course/buyCourse",
};

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: SERVER_URL + "/course/getReviews",
};

// CATAGORIES API
export const categories = {
  CATEGORIES_API: SERVER_URL + "/course/showAllCategories",
};

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: SERVER_URL + "/course/getCategoryPageDetails",
};
// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: SERVER_URL + "/reach/contact",
};

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: SERVER_URL + "/profile/updateUserProfileImage",
  UPDATE_PROFILE_API: SERVER_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: SERVER_URL + "/auth/changepassword",
  DELETE_PROFILE_API: SERVER_URL + "/profile/deleteProfile",
};
