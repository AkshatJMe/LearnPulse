//@ts-nocheck
import { Profile } from "../models/profile.js";
import { User } from "../models/user.js";
import { Course } from "../models/course.js";
import {
  uploadImageToCloudinary,
  deleteResourceFromCloudinary,
} from "../utils/imageUploader.js";
import { convertSecondsToDuration } from "../utils/secToDuration.js";
import { Request, Response } from "express";
import { UserRequestBody } from "../types/profile/UpdateProfile.js";

export const updateProfile = async (
  req: Request<{}, {}, UserRequestBody>,
  res: Response
) => {
  try {
    // Extract profile data from request body
    const {
      gender = "",
      dateOfBirth = "",
      about = "",
      contactNumber,
      firstName,
      lastName,
    } = req.body;

    // Retrieve user ID from request object
    const userId = req.user?.id;

    // Find the user and their profile details
    const userDetails = await User.findById(userId);
    const profileId = userDetails?.additionalDetails; // Get associated profile ID
    const profileDetails = await Profile.findById(profileId);

    // Update user details
    userDetails!.firstName = firstName;
    userDetails!.lastName = lastName;
    await userDetails?.save(); // Save updated user details

    // Update profile details
    profileDetails!.gender = gender;
    profileDetails!.dateOfBirth = dateOfBirth;
    profileDetails!.about = about;
    profileDetails!.contactNumber = contactNumber;
    await profileDetails?.save(); // Save updated profile details

    // Retrieve and return updated user details with populated profile
    const updatedUserDetails = await User.findById(userId).populate({
      path: "additionalDetails",
    });

    res.status(200).json({
      success: true,
      updatedUserDetails,
      message: "Profile updated successfully",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Error while updating profile",
    });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    // Retrieve user ID from request object
    const userId = req.user?.id;

    // Find user details
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user's profile image from Cloudinary
    await deleteResourceFromCloudinary(userDetails.image);

    // Remove user from all enrolled courses
    const userEnrolledCoursesId = userDetails?.courses;
    for (const courseId of userEnrolledCoursesId) {
      await Course.findByIdAndUpdate(courseId, {
        $pull: { studentsEnrolled: userId },
      });
    }

    // Delete user's profile and account
    await Profile.findByIdAndDelete(userDetails.additionalDetails);
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Error while deleting profile",
    });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    // Retrieve user ID from request object
    const userId = req.user?.id;

    // Find user details with populated profile information
    const userDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec();

    res.status(200).json({
      success: true,
      data: userDetails,
      message: "User data fetched successfully",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Error while fetching user details",
    });
  }
};

export const updateUserProfileImage = async (req: Request, res: Response) => {
  try {
    // Extract profile image from the request files
    const profileImage = req.files?.profileImage;
    // Retrieve the user ID from the request object
    const userId = req.user?.id;

    // Upload the image to Cloudinary with specified dimensions
    const image = await uploadImageToCloudinary(
      profileImage,
      process.env.FOLDER_NAME,
      1000, // width
      1000 // height
    );

    // Update the user's image URL in the database
    const updatedUserDetails = await User.findByIdAndUpdate(
      userId,
      { image: image?.secure_url },
      { new: true } // Return the updated document
    ).populate({
      path: "additionalDetails", // Populate additional profile details
    });

    // Send a success response with updated user details
    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedUserDetails,
    });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      success: false,
      message: "Error while updating user profile image",
    });
  }
};

export const getEnrolledCourses = async (req: Request, res: Response) => {
  try {
    // Retrieve the user ID from the request object
    const userId = req.user.id;

    // Find the user and populate their enrolled courses with course content and subsections
    const userDetails = await User.findOne({ _id: userId })
      .populate({
        path: "courses",
        populate: [
          {
            path: "instructor",
            select: "firstName lastName email image",
          },
          {
            path: "category",
            select: "name",
          },
          {
            path: "courseContent",
            populate: {
              path: "subSection", // Populate subsections of course content
            },
          },
        ],
      })
      .exec();

    // Handle case where no user details are found
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      });
    }

    // Convert userDetails to plain JavaScript object for manipulation
    const plainUserDetails = userDetails.toObject();

    // Loop through each course to calculate total duration and progress
    // for (const course of userDetails.courses) {
    //   let totalDurationInSeconds = 0;
    //   let subsectionLength = 0;

    //   // Calculate total duration and count subsections
    //   for (const content of course.courseContent) {
    //     totalDurationInSeconds += content.subSection.reduce(
    //       (acc, curr) => acc + parseInt(curr.timeDuration),
    //       0
    //     );
    //     subsectionLength += content.subSection.length;
    //   }

    //   // Convert total duration to a human-readable format
    //   course.totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    //   // Find the user's progress in the course
    //   let courseProgressCount = await CourseProgress.findOne({
    //     courseID: course._id,
    //     userId: userId,
    //   });

    //   courseProgressCount = courseProgressCount?.completedVideos.length || 0;

    //   // Calculate progress percentage
    //   course.progressPercentage =
    //     subsectionLength === 0
    //       ? 100
    //       : Math.round((courseProgressCount / subsectionLength) * 100 * 100) /
    //         100;
    // }
    // Return the user's enrolled courses with calculated details
    return res.status(200).json({
      success: true,
      data: plainUserDetails.courses || [],
    });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      success: false,
      message: "Data fetch ni ho pa raha",
    });
  }
};

export const instructorDashboard = async (req: Request, res: Response) => {
  try {
    // Find all courses created by the instructor
    const courseDetails = await Course.find({ instructor: req.user.id });

    // Map each course to include additional statistics
    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      };

      return courseDataWithStats;
    });

    // Return the dashboard data with course statistics
    res.status(200).json({
      courses: courseData,
      message: "Instructor Dashboard Data fetched successfully",
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    // Fetch all users with accountType "Student" and populate related fields
    const allStudentsDetails = await User.find({
      accountType: "student",
    })
      .populate("additionalDetails") // Populate additional profile details
      .populate("courses") // Populate enrolled courses
      .sort({ createdAt: -1 }); // Sort by creation date in descending order

    // Count the total number of students
    const studentsCount = await User.countDocuments({
      accountType: "student",
    });

    // Send the response with students details and count
    res.status(200).json({
      allStudentsDetails,
      studentsCount,
      message: "All Students Data fetched successfully",
    });
  } catch (error) {
    // Log and handle any errors that occur
    res.status(500).json({
      message: "Error while fetching all students",
      error: error.message,
    });
  }
};

export const getAllInstructors = async (req: Request, res: Response) => {
  try {
    // Fetch all users with accountType "Instructor" and populate related fields
    const allInstructorsDetails = await User.find({
      accountType: "instructor",
    })
      .populate("additionalDetails") // Populate additional profile details
      .populate("courses") // Populate courses taught by the instructor
      .sort({ createdAt: -1 }); // Sort by creation date in descending order

    // Count the total number of instructors
    const instructorsCount = await User.countDocuments({
      accountType: "instructor",
    });

    // Send the response with instructors details and count
    res.status(200).json({
      allInstructorsDetails,
      instructorsCount,
      message: "All Instructors Data fetched successfully",
    });
  } catch (error) {
    // Log and handle any errors that occur
    res.status(500).json({
      message: "Error while fetching all Instructors",
      error: error.message,
    });
  }
};
