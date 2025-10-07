//@ts-nocheck
import { Request, Response } from "express"; // Importing Request and Response types from express
import { uploadImageToCloudinary } from "../utils/imageUploader.js"; // Importing utility function to upload images to Cloudinary
import { SubSection } from "../models/subSection.js"; // Importing SubSection model

// Controller function to handle creating a new sub-section
export const createSubSection = async (req: Request, res: Response) => {
  try {
    // Extracting title, description, and sectionId from the request body
    const { title, description, sectionId } = req.body;

    // Extracting the video file from the request files
    const videoFile = req.files.video;
    // console.log('videoFile ', videoFile) // For debugging purposes

    // Validation to ensure all required fields are provided
    if (!title || !description || !videoFile || !sectionId) {
      // If any required field is missing, respond with a 400 Bad Request status and an error message
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Uploading the video file to Cloudinary and getting its details
    const videoFileDetails = await uploadImageToCloudinary(
      videoFile,
      process.env.FOLDER_NAME // Folder name from environment variables
    );

    // Creating a new sub-section entry in the database
    const SubSectionDetails = await SubSection.create({
      title,
      timeDuration: videoFileDetails.duration, // Duration of the video
      description,
      videoUrl: videoFileDetails.secure_url, // Secure URL of the uploaded video
    });

    // Linking the newly created sub-section to the corresponding section
    // Updating the section by adding the new sub-section ID to the subSection array
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true } // Return the updated document
    ).populate("subSection"); // Populating the subSection field

    // Sending a successful response with the updated section details
    res.status(200).json({
      success: true,
      data: updatedSection,
      message: "SubSection created successfully",
    });
  } catch (error) {
    // Handling any errors that occur and responding with a 500 Internal Server Error status
    res.status(500).json({
      success: false,
      message: "Error while creating SubSection",
    });
  }
};

// Controller function to handle updating an existing sub-section
export const updateSubSection = async (req: Request, res: Response) => {
  try {
    // Extracting sectionId, subSectionId, title, and description from the request body
    const { sectionId, subSectionId, title, description } = req.body;

    // Validation to ensure subSectionId is provided
    if (!subSectionId) {
      // If subSectionId is missing, respond with a 400 Bad Request status and an error message
      return res.status(400).json({
        success: false,
        message: "subSection ID is required to update",
      });
    }

    // Finding the sub-section in the database
    const subSection = await SubSection.findById(subSectionId);

    // If the sub-section is not found, respond with a 404 Not Found status and an error message
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // Updating the sub-section's title and description if provided
    if (title) {
      subSection.title = title;
    }

    if (description) {
      subSection.description = description;
    }

    // If a new video file is provided, upload it to Cloudinary and update the sub-section
    if (req.files && (req.files.videoFile !== undefined || req.files.video !== undefined)) {
      const video = req.files.videoFile || req.files.video;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME // Folder name from environment variables
      );
      subSection.videoUrl = uploadDetails.secure_url; // Update video URL
      subSection.timeDuration = uploadDetails.duration; // Update video duration
    }

    // Saving the updated sub-section details to the database
    await subSection.save();

    // Fetching the updated section details and populating the subSection field
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    // Sending a successful response with the updated section details
    return res.json({
      success: true,
      data: updatedSection,
      message: "Section updated successfully",
    });
  } catch (error) {
    // Handling any errors that occur and responding with a 500 Internal Server Error status
    return res.status(500).json({
      success: false,
      message: "Error while updating the section",
    });
  }
};

// Controller function to handle deleting a sub-section
export const deleteSubSection = async (req: Request, res: Response) => {
  try {
    // Extracting subSectionId and sectionId from the request body
    const { subSectionId, sectionId } = req.body;

    // Removing the sub-section ID from the section's subSection array
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId, // Remove the specific sub-section ID
        },
      }
    );

    // Deleting the sub-section from the database
    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });

    // If the sub-section is not found, respond with a 404 Not Found status and an error message
    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" });
    }

    // Fetching the updated section details and populating the subSection field
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    // Sending a successful response with the updated section details
    return res.json({
      success: true,
      data: updatedSection,
      message: "SubSection deleted successfully",
    });
  } catch (error) {
    // Handling any errors that occur and responding with a 500 Internal Server Error status
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    });
  }
};
