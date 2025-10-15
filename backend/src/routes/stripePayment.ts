import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  createCheckoutSession,
  stripeWebhook,
  verifyPayment,
  getPaymentHistory,
} from "../controllers/stripePayment.js";

const router = express.Router();

// ================ Stripe Payment Routes ================

// Create checkout session
router.post("/create-checkout-session", auth, createCheckoutSession);

// Stripe webhook (no auth required, Stripe will verify)
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// Verify payment
router.post("/verify", auth, verifyPayment);
router.post("/verify-session", auth, verifyPayment);

// Get payment history
router.get("/history", auth, getPaymentHistory);
router.get("/payment-history", auth, getPaymentHistory);

export default router;
