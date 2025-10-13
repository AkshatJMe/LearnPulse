import express from "express";
import { auth, isAdmin, isStudent } from "../middlewares/auth.js";
import {
  generateCertificate,
  getUserCertificates,
  getCertificateById,
  verifyCertificate,
  downloadCertificate,
  revokeCertificate,
} from "../controllers/certificate.js";

const router = express.Router();

// ================ Certificate Routes ================

// Generate certificate (Student)
router.post("/generate", auth, isStudent, generateCertificate);

// Get user certificates
router.get("/my-certificates", auth, getUserCertificates);

// Get certificate by ID (public)
router.get("/:certificateId", getCertificateById);

// Verify certificate (public)
router.get("/verify/:certificateId", verifyCertificate);

// Download certificate
router.get("/download/:certificateId", auth, downloadCertificate);

// Revoke certificate (Admin only)
router.delete("/revoke/:certificateId", auth, isAdmin, revokeCertificate);

export default router;
