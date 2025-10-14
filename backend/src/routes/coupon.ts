import express from "express";
import { auth, isAdmin } from "../middlewares/auth.js";
import {
  allCoupons,
  applyDiscount,
  deleteCoupon,
  getCoupon,
  newCoupon,
  updateCoupon,
} from "../controllers/coupon.js";

const app = express.Router();

// route - /api/v1/coupon/discount - Validate coupon (public, no auth needed)
app.get("/discount", applyDiscount);

// route - /api/v1/coupon/coupon/new - Create coupon (admin only)
app.post("/coupon/new", auth, isAdmin, newCoupon);

// route - /api/v1/coupon/coupon/all - Get all coupons (admin only)
app.get("/coupon/all", auth, isAdmin, allCoupons);

// route - /api/v1/coupon/coupon/:id - Get/Update/Delete coupon (admin only)
app
  .route("/coupon/:id")
  .get(auth, isAdmin, getCoupon)
  .put(auth, isAdmin, updateCoupon)
  .delete(auth, isAdmin, deleteCoupon);

// Exporting the Express router instance with defined routes
export default app;
