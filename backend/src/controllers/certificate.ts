import { Request, Response } from "express";
import { Certificate } from "../models/certificate.js";
import { Course } from "../models/course.js";
import { User } from "../models/user.js";
import { CourseProgress } from "../models/courseProgress.js";
import { mailSender } from "../utils/mailSender.js";
import { certificateEmail } from "../mail/templates/certificateEmail.js";
import crypto from "crypto";

// ================ Generate Certificate ================

export const generateCertificate = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({ userId, courseId });
    if (existingCertificate) {
      return res.status(400).json({
        success: false,
        message: "Certificate already generated for this course",
        certificate: existingCertificate,
      });
    }

    // Verify course completion
    const courseProgress = await CourseProgress.findOne({ userId, courseID: courseId });
    const course = await Course.findById(courseId).populate("instructor", "firstName lastName");
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!courseProgress) {
      return res.status(400).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Check if all videos are completed (100% progress)
    const totalVideos = course.courseContent.length; // Simplified check
    const completedVideos = courseProgress.completedVideos?.length || 0;
    
    // For now, we'll allow certificate generation if enrolled
    // In production, you'd have more sophisticated completion tracking
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate unique certificate ID
    const certificateId = `CERT-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;

    // Create certificate
    const certificate = await Certificate.create({
      userId,
      courseId,
      certificateId,
      studentName: `${user.firstName} ${user.lastName}`,
      courseName: course.courseName,
      instructorName: `${(course.instructor as any).firstName} ${(course.instructor as any).lastName}`,
      completionDate: new Date(),
    });

    // Send certificate email
    await mailSender(
      user.email,
      "Congratulations! Your Certificate is Ready",
      certificateEmail(
        `${user.firstName} ${user.lastName}`,
        course.courseName,
        certificateId
      )
    );

    return res.status(201).json({
      success: true,
      message: "Certificate generated successfully",
      certificate,
    });
  } catch (error) {
    console.error("Error generating certificate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate certificate",
    });
  }
};

// ================ Get User Certificates ================

export const getUserCertificates = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;

    const certificates = await Certificate.find({ userId, isValid: true })
      .populate("userId", "firstName lastName email")
      .populate({
        path: "courseId",
        select: "courseName thumbnail instructor",
        populate: {
          path: "instructor",
          select: "firstName lastName",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      certificates,
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch certificates",
    });
  }
};

// ================ Get Certificate by ID ================

export const getCertificateById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId })
      .populate("userId", "firstName lastName email")
      .populate({
        path: "courseId",
        select: "courseName thumbnail instructor",
        populate: {
          path: "instructor",
          select: "firstName lastName",
        },
      });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    return res.status(200).json({
      success: true,
      certificate,
    });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch certificate",
    });
  }
};

// ================ Verify Certificate ================

export const verifyCertificate = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId, isValid: true })
      .populate("userId", "firstName lastName")
      .populate("courseId", "courseName");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found or invalid",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certificate is valid",
      certificate: {
        certificateId: certificate.certificateId,
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        instructorName: certificate.instructorName,
        completionDate: certificate.completionDate,
        issueDate: certificate.issueDate,
      },
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify certificate",
    });
  }
};

// ================ Download Certificate ================

export const downloadCertificate = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({
      _id: certificateId,
      userId,
      isValid: true,
    })
      .populate("userId", "firstName lastName email")
      .populate({
        path: "courseId",
        select: "courseName thumbnail instructor",
        populate: {
          path: "instructor",
          select: "firstName lastName",
        },
      });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found or access denied",
      });
    }

    // Return full certificate data for PDF generation on frontend
    return res.status(200).json({
      success: true,
      certificate,
      message: "Certificate retrieved successfully",
    });
  } catch (error) {
    console.error("Error downloading certificate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to download certificate",
    });
  }
};

// ================ Revoke Certificate (Admin) ================

export const revokeCertificate = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOneAndUpdate(
      { certificateId },
      { isValid: false },
      { new: true }
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certificate revoked successfully",
      certificate,
    });
  } catch (error) {
    console.error("Error revoking certificate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to revoke certificate",
    });
  }
};
