import express from "express"; // Importing express to create a new router instance

// Creating a new Express router instance to define route handlers
const app = express.Router();

// Importing controller functions for handling course-related routes
import {
  createCourse, // Function to handle the creation of a new course
  getCourseDetails, // Function to retrieve details for a specific course
  getAllCourses, // Function to get a list of all courses
  getFullCourseDetails, // Function to get full details of a course
  editCourse, // Function to handle course updates
  deleteCourse, // Function to handle course deletion
  getInstructorCourses,
  getCoursesByCategory,
  buyCourse, // Function to get all courses taught by a specific instructor
} from "../controllers/course.js";

// Importing controller function for handling course progress updates
import { updateCourseProgress } from "../controllers/courseProgress.js";

// Importing controller functions for handling category-related routes
import {
  createCategory, // Function to handle the creation of a new category
  showAllCategories, // Function to retrieve a list of all categories
  getCategoryPageDetails, // Function to get details of a specific category page
  deleteCategory, // Function to handle the deletion of a category
} from "../controllers/category.js";

// Importing controller functions for handling section-related routes
import {
  createSection, // Function to handle the creation of a new section
  updateSection, // Function to handle updates to an existing section
  deleteSection, // Function to handle the deletion of a section
} from "../controllers/section.js";

// Importing controller functions for handling sub-section-related routes
import {
  createSubSection, // Function to handle the creation of a new sub-section
  updateSubSection, // Function to handle updates to an existing sub-section
  deleteSubSection, // Function to handle the deletion of a sub-section
} from "../controllers/subSection.js";

// Importing controller functions for handling rating and review-related routes
import {
  createRating, // Function to handle the creation of a new rating
  getAverageRating, // Function to retrieve the average rating of a course
  getAllRatingReview, // Function to get all reviews for a course
} from "../controllers/ratingAndReview.js";

// Importing middleware functions for authentication and authorization
import { auth, isAdmin, isInstructor, isStudent } from "../middlewares/auth.js";

// Route for creating a new course
// This route is accessible only to authenticated instructors
app.post("/createCourse", auth, isInstructor, createCourse);

// Route for adding a section to a course
// This route is accessible only to authenticated instructors
app.post("/addSection", auth, isInstructor, createSection);

// Route for updating an existing section
// This route is accessible only to authenticated instructors
app.post("/updateSection", auth, isInstructor, updateSection);

// Route for deleting a section
// This route is accessible only to authenticated instructors
app.post("/deleteSection", auth, isInstructor, deleteSection);

// Route for adding a sub-section to a section
// This route is accessible only to authenticated instructors
app.post("/addSubSection", auth, isInstructor, createSubSection);

// Route for updating an existing sub-section
// This route is accessible only to authenticated instructors
app.post("/updateSubSection", auth, isInstructor, updateSubSection);

// Route for deleting a sub-section
// This route is accessible only to authenticated instructors
app.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

// Route for getting details of a specific course
// This route is accessible to anyone (public route)
app.post("/getCourseDetails", getCourseDetails);

// Route for getting a list of all courses
// This route is accessible to anyone (public route)
app.get("/getAllCourses", getAllCourses);

// Route for getting a list of all courses by category
// This route is accessible to anyone (public route)
app.post("/getAllCoursesByCategory", getCoursesByCategory);

// Route for getting full details of a course
// This route is accessible only to authenticated users
app.post("/getFullCourseDetails", auth, getFullCourseDetails);

// Route for getting all courses under a specific instructor
// This route is accessible only to authenticated instructors
app.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);

// Route for editing a course
// This route is accessible only to authenticated instructors
app.post("/editCourse", auth, isInstructor, editCourse);

// Route for deleting a course
// This route is accessible only to authenticated instructors
app.delete("/deleteCourse/:courseId", auth, isInstructor, deleteCourse);

// Route for updating course progress
// This route is accessible only to authenticated students
app.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// Route for creating a new category
// This route is accessible only to authenticated admins
app.post("/createCategory", auth, isAdmin, createCategory);

// Route for deleting a category
// This route is accessible only to authenticated admins
app.delete("/deleteCategory", auth, isAdmin, deleteCategory);

// Route for retrieving a list of all categories
// This route is accessible to anyone (public route)
app.get("/showAllCategories", showAllCategories);

// Route for getting details of a specific category page
// This route is accessible to anyone (public route)
app.post("/getCategoryPageDetails", getCategoryPageDetails);

// Route for creating a new rating
// This route is accessible only to authenticated students
app.post("/createRating", auth, isStudent, createRating);

// Route for getting the average rating of a course
// This route is accessible to anyone (public route)
app.get("/getAverageRating", getAverageRating);

// Route for getting all reviews for a course
// This route is accessible to anyone (public route)
app.get("/getReviews", getAllRatingReview);

// Route for buy course
app.post("/buyCourse", auth, isStudent, buyCourse);

// Exporting the router instance to be used in the main application
export default app;
