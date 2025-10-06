import { Request, Response } from "express"; // Importing Request and Response types from express
import { Section } from "../models/section.js"; // Importing Section model
import { Course } from "../models/course.js"; // Importing Course model

// Controller function to handle creating a new section
export const createSection = async (req: Request, res: Response) => {
  try {
    // Extracting sectionName and courseId from the request body
    const { sectionName, courseId } = req.body;

    // Validating that both sectionName and courseId are provided
    if (!sectionName || !courseId) {
      // If any field is missing, respond with a 400 Bad Request status and an error message
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Creating a new section in the database with the provided sectionName
    const newSection = await Section.create({ sectionName });

    // Updating the course by adding the new section's ID to the courseContent array
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true } // Return the updated document
    );

    // Fetching the updated course details and populating the courseContent and its subSections
    const updatedCourseDetails = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    });

    // Sending a successful response with the updated course details
    res.status(200).json({
      success: true,
      data: updatedCourseDetails,
      message: "Section created successfully",
    });
  } catch (error) {
    // Handling any errors that occur and responding with a 500 Internal Server Error status
    res.status(500).json({
      success: false,
      message: "Error while creating section",
    });
  }
};

// Controller function to handle updating an existing section
export const updateSection = async (req: Request, res: Response) => {
  try {
    // Extracting sectionName, sectionId, and courseId from the request body
    const { sectionName, sectionId, courseId } = req.body;

    // Validating that sectionId is provided (sectionName is optional in this case)
    if (!sectionId) {
      // If sectionId is missing, respond with a 400 Bad Request status and an error message
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Updating the section in the database with the provided sectionName
    await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });

    // Fetching the updated course details and populating the courseContent and its subSections
    const updatedCourseDetails = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    });

    // Sending a successful response with the updated course details
    res.status(200).json({
      success: true,
      data: updatedCourseDetails,
      message: "Section updated successfully",
    });
  } catch (error) {
    // Handling any errors that occur and responding with a 500 Internal Server Error status
    res.status(500).json({
      success: false,
      message: "Error while updating section",
    });
  }
};

// Controller function to handle deleting a section
export const deleteSection = async (req: Request, res: Response) => {
  try {
    // Extracting sectionId and courseId from the request body
    const { sectionId, courseId } = req.body;

    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "sectionId and courseId are required",
      });
    }

    // Remove section reference from course
    await Course.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    });

    // Deleting the section from the database
    await Section.findByIdAndDelete(sectionId);

    // Fetching the updated course details and populating the courseContent and its subSections
    const updatedCourseDetails = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    });

    // Sending a successful response with the updated course details
    res.status(200).json({
      success: true,
      data: updatedCourseDetails,
      message: "Section deleted successfully",
    });
  } catch (error) {
    // Handling any errors that occur and responding with a 500 Internal Server Error status
    res.status(500).json({
      success: false,
      message: "Error while deleting section",
    });
  }
};
