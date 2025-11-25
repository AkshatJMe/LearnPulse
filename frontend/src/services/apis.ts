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
  GET_PLATFORM_ANALYTICS_API: SERVER_URL + "/admin/analytics",
  GET_PENDING_COURSES_API: SERVER_URL + "/admin/courses/pending",
  APPROVE_COURSE_API: SERVER_URL + "/admin/courses/approve",
  REJECT_COURSE_API: SERVER_URL + "/admin/courses/reject",
  DISABLE_COURSE_API: SERVER_URL + "/admin/courses/disable",
  GET_ALL_USERS_API: SERVER_URL + "/admin/users",
  TOGGLE_USER_STATUS_API: SERVER_URL + "/admin/users/toggle-status",
  REMOVE_REVIEW_API: SERVER_URL + "/admin/reviews",
  ADMIN_DELETE_COURSE_API: SERVER_URL + "/admin/courses",
  DELETE_USER_API: SERVER_URL + "/admin/users",
};

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: SERVER_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: SERVER_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API:
    SERVER_URL + "/payment/sendPaymentSuccessEmail",
};

// STRIPE PAYMENT ENDPOINTS
export const stripeEndpoints = {
  CREATE_CHECKOUT_SESSION_API: SERVER_URL + "/stripe/create-checkout-session",
  VERIFY_SESSION_API: SERVER_URL + "/stripe/verify-session",
  GET_PAYMENT_HISTORY_API: SERVER_URL + "/stripe/payment-history",
};

// WISHLIST ENDPOINTS
export const wishlistEndpoints = {
  GET_WISHLIST_API: SERVER_URL + "/wishlist",
  ADD_TO_WISHLIST_API: SERVER_URL + "/wishlist/add",
  REMOVE_FROM_WISHLIST_API: SERVER_URL + "/wishlist/remove",
  TOGGLE_WISHLIST_API: SERVER_URL + "/wishlist/toggle",
};

// CART ENDPOINTS
export const cartEndpoints = {
  GET_CART_API: SERVER_URL + "/cart",
  ADD_TO_CART_API: SERVER_URL + "/cart/add",
  REMOVE_FROM_CART_API: SERVER_URL + "/cart/remove",
  CLEAR_CART_API: SERVER_URL + "/cart/clear",
};

// QUIZ ENDPOINTS
export const quizEndpoints = {
  CREATE_QUIZ_API: SERVER_URL + "/quiz/create",
  GET_QUIZ_API: SERVER_URL + "/quiz/get",
  GET_COURSE_QUIZZES_API: SERVER_URL + "/quiz/course",
  SUBMIT_QUIZ_API: SERVER_URL + "/quiz/submit",
  GET_QUIZ_RESULTS_API: SERVER_URL + "/quiz/results",
  UPDATE_QUIZ_API: SERVER_URL + "/quiz/update",
  DELETE_QUIZ_API: SERVER_URL + "/quiz/delete",
};

// DISCUSSION ENDPOINTS
export const discussionEndpoints = {
  CREATE_THREAD_API: SERVER_URL + "/discussion/create",
  GET_COURSE_DISCUSSIONS_API: SERVER_URL + "/discussion/course",
  ADD_REPLY_API: SERVER_URL + "/discussion/reply",
  UPVOTE_THREAD_API: SERVER_URL + "/discussion/upvote",
  UPVOTE_REPLY_API: SERVER_URL + "/discussion/upvote-reply",
};

// CERTIFICATE ENDPOINTS
export const certificateEndpoints = {
  GENERATE_CERTIFICATE_API: SERVER_URL + "/certificate/generate",
  GET_CERTIFICATE_API: SERVER_URL + "/certificate",
  GET_CERTIFICATE_BY_ID_API: SERVER_URL + "/certificate",
  DOWNLOAD_CERTIFICATE_API: SERVER_URL + "/certificate/download",
  VERIFY_CERTIFICATE_API: SERVER_URL + "/certificate/verify",
  GET_USER_CERTIFICATES_API: SERVER_URL + "/certificate/my-certificates",
};

// ANALYTICS ENDPOINTS
export const analyticsEndpoints = {
  GET_INSTRUCTOR_ANALYTICS_API: SERVER_URL + "/analytics/instructor",
  GET_COURSE_ANALYTICS_API: SERVER_URL + "/analytics/course",
};


// COUPON ENDPOINTS
export const couponEndpoints = {
  VALIDATE_COUPON_API: SERVER_URL + "/coupon/discount",
  GET_ALL_COUPONS_API: SERVER_URL + "/coupon/coupon/all",
  CREATE_COUPON_API: SERVER_URL + "/coupon/coupon/new",
  GET_COUPON_API: SERVER_URL + "/coupon/coupon",
  UPDATE_COUPON_API: SERVER_URL + "/coupon/coupon",
  DELETE_COUPON_API: SERVER_URL + "/coupon/coupon",
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
  EDIT_CATEGORY_API: SERVER_URL + "/course/editCategory",
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
