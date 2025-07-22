import { Request, Response } from "express";
import { Category } from "../models/category.js";
import {
  deleteResourceFromCloudinary,
  uploadImageToCloudinary,
} from "../utils/imageUploader.js";
import { Course } from "../models/course.js";
import { User } from "../models/user.js";
import { convertSecondsToDuration } from "../utils/secToDuration.js";
import { CourseProgress } from "../models/courseProgress.js";
import { Section } from "../models/section.js";
import { SubSection } from "../models/subSection.js";

// Handler to create a new course
export const createCourse = async (req: Request, res: Response) => {
  try {
    // Extract data from request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      instructions: _instructions,
      status,
      tag: _tag,
    } = req.body;

    // Parse JSON strings for instructions and tags
    const tag = JSON.parse(_tag);
    const instructions = JSON.parse(_instructions);

    // Extract uploaded thumbnail image from request files
    const thumbnail = req.files?.thumbnailImage;

    // Validate required fields
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !thumbnail ||
      !instructions.length ||
      !tag.length
    ) {
      // Respond with a 400 status code if any required field is missing
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Default status to "Draft" if not provided
    if (!status || status === undefined) {
      status = "Draft";
    }

    // Get instructor ID from the request user
    //@ts-ignore
    const instructorId = req.user?.id;

    // Check if the provided category ID is valid
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      // Respond with a 401 status code if the category is not found
      return res.status(401).json({
        success: false,
        message: "Category details not found",
      });
    }

    // Upload thumbnail image to Cloudinary and get its secure URL
    //@ts-ignore
    const thumbnailDetails = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // Create a new course in the database
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorId,
      whatYouWillLearn,
      price,
      category: categoryDetails._id,
      tag,
      status,
      instructions,
      thumbnail: thumbnailDetails?.secure_url,
      createdAt: Date.now(),
    });

    // Update the instructor's courses list
    await User.findByIdAndUpdate(
      instructorId,
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // Update the category's courses list
    await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // Respond with a 200 status code and the newly created course
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "New course created successfully",
    });
  } catch (error) {
    // Handle any errors that occur during course creation
    res.status(500).json({
      success: false,
      message: "Error while creating new course",
    });
  }
};

// Handle to buy course dummy API
export const buyCourse = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { courseId } = req.body;

    console.log(userId, courseId);

    // Validate input
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // Find user and course
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if already enrolled
    // @ts-ignore
    if (user?.courses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: "User already enrolled in this course",
      });
    }

    // Add course to user's list
    //@ts-ignore
    user.courses.push(courseId);
    await user.save();

    // Add user to course's enrolled list
    //@ts-ignore
    course.studentsEnrolled.push(userId);
    await course.save();

    res.status(200).json({
      success: true,
      message: "Course purchased successfully",
      data: {
        courseId: course._id,
        userId: user._id,
      },
    });
  } catch (error) {
    console.error("Buy Course Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to purchase course",
    });
  }
};

// Handler to get all courses
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    // Retrieve all courses from the database with selected fields
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        courseDescription: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate({
        path: "instructor",
        select: "firstName lastName email image",
      })
      .exec();

    // Respond with a 200 status code and the list of all courses
    return res.status(200).json({
      success: true,
      data: allCourses,
      message: "Data for all courses fetched successfully",
    });
  } catch (error) {
    // Handle any errors that occur during fetching courses
    res.status(500).json({
      success: false,
      message: "Error while fetching data of all courses",
    });
  }
};

// export const getCoursesByCategory = async (req: Request, res: Response) => {
//   try {
//     const { category } = req.body;

//     console.log(req.body);

//     if (!category) {
//       return res.status(400).json({
//         success: false,
//         message: "category is required in the request body",
//       });
//     }

//     // Find courses by category
//     const allCourses = await Course.find(
//       { category }, // Filtering condition
//       {
//         courseName: true,
//         courseDescription: true,
//         price: true,
//         thumbnail: true,
//         instructor: true,
//         ratingAndReviews: true,
//         studentsEnrolled: true,
//       }
//     )
//       .populate({
//         path: "instructor",
//         select: "firstName lastName email image",
//       })
//       .exec();

//     return res.status(200).json({
//       success: true,
//       data: allCourses,
//       message: "Courses fetched successfully for the given category",
//     });
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error while fetching courses",
//     });
//   }
// };

// utility function

export const getCoursesByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.body; // from route: /category/:categorySlug

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "category slug is required in the URL",
      });
    }
    // Step 1: Find category document by name
    const categoryDoc = await Category.findOne({ name: category });

    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        message: `No category found with name ${category}`,
      });
    }

    // Step 2: Find all courses that belong to this category
    const allCourses = await Course.find(
      { category: categoryDoc._id },
      {
        courseName: true,
        courseDescription: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate({
        path: "instructor",
        select: "firstName lastName email image",
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: allCourses,
      message: `Courses for category "${category}" fetched successfully.`,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching courses",
    });
  }
};

// Handler to get course details
export const getCourseDetails = async (req: Request, res: Response) => {
  try {
    // Extract course ID from request body
    const { courseId } = req.body;

    // Fetch course details from the database, populating related fields
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl", // Exclude videoUrl from subSection data
        },
      })
      .exec();

    // Validate if the course exists
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ${courseId}`,
      });
    }

    // Check if the course status is "Draft"
    if (courseDetails.status === "Draft") {
      return res.status(403).json({
        success: false,
        message: `Accessing a draft course is forbidden`,
      });
    }

    // Calculate the total duration of the course by summing up the duration of each subSection
    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      //@ts-ignore
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    // Convert total duration from seconds to a more readable format
    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    // Respond with course details and total duration
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
      message: "Fetched course data successfully",
    });
  } catch (error) {
    // Handle any errors that occur during fetching course details
    return res.status(500).json({
      success: false,
      message: "Error while fetching course details",
    });
  }
};

// Handler to get-full course details
export const getFullCourseDetails = async (req: Request, res: Response) => {
  try {
    // Extract course ID from request body and user ID from request user
    const { courseId } = req.body; //@ts-ignore
    const userId = req.user?.id;

    // Fetch course details from the database, populating related fields
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // Fetch progress data for the user in the specific course
    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    // Validate if the course exists
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // Check if the course status is "Draft"
    if (courseDetails.status === "Draft") {
      return res.status(403).json({
        success: false,
        message: `Accessing a draft course is forbidden`,
      });
    }

    // Calculate the total duration of the course by summing up the duration of each subSection
    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      //@ts-ignore
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    // Convert total duration from seconds to a more readable format
    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    // Respond with course details, total duration, and user's progress in the course
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [], // Provide an empty array if no completed videos are found
      },
    });
  } catch (error) {
    // Handle any errors that occur during fetching full course details
    return res.status(500).json({
      success: false,
      message: "Details not found",
    });
  }
};

// Edit course details
export const editCourse = async (req: Request, res: Response) => {
  try {
    // Extract course ID and updates from the request body
    const { courseId } = req.body;
    const updates = req.body;

    // Find the course to update
    const course = await Course.findById(courseId);

    // If the course is not found, return a 404 error
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if files are uploaded and update the thumbnail image if present
    if (req.files) {
      const thumbnail = req.files.thumbnailImage; //@ts-ignore
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage?.secure_url;
    }

    // Update the course with new values from the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        // Parse JSON fields (e.g., tags, instructions) before updating
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          //@ts-ignore
          course[key] = updates[key];
        }
      }
    }
    //@ts-ignore
    course.updatedAt = Date.now(); // Update the timestamp

    // Save the updated course data to the database
    await course.save();

    // Fetch the updated course with populated fields
    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // Return a success response with updated course data
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    // Handle any errors that occur during the update process
    res.status(500).json({
      success: false,
      message: "Error while updating course",
    });
  }
};

// get all coursed for intructors
export const getInstructorCourses = async (req: Request, res: Response) => {
  try {
    // Get instructor ID from the request user
    //@ts-ignore
    const instructorId = req.user?.id;

    // Find courses by the instructor ID and sort them by creation date (most recent first)
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 });

    // Return a success response with the list of instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
      message: "Courses made by instructor fetched successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the retrieval process
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
    });
  }
};

// Handler delete couse
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    // Extract course ID from request body
    const { courseId } = req.params;

    console.log(req.params);

    // Find the course to delete
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete the course's thumbnail image from Cloudinary
    await deleteResourceFromCloudinary(course?.thumbnail);

    // Delete sections and sub-sections related to the course
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Find the section and delete its sub-sections
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection; //@ts-ignore
        for (const subSectionId of subSections) {
          const subSection = await SubSection.findById(subSectionId);
          if (subSection) {
            // Delete video associated with the sub-section from Cloudinary
            await deleteResourceFromCloudinary(subSection.videoUrl);
          }
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }
      await Section.findByIdAndDelete(sectionId);
    }

    // Finally, delete the course itself
    await Course.findByIdAndDelete(courseId);

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the deletion process
    return res.status(500).json({
      success: false,
      message: "Error while deleting course",
    });
  }
};
