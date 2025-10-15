import express from "express";
import { auth, isStudent } from "../middlewares/auth.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
} from "../controllers/wishlist.js";

const router = express.Router();

// ================ Wishlist Routes ================

// Get user wishlist
router.get("/", auth, isStudent, getWishlist);

// Add course to wishlist
router.post("/add", auth, isStudent, addToWishlist);

// Remove course from wishlist
router.delete("/remove", auth, isStudent, removeFromWishlist);

// Toggle wishlist
router.post("/toggle", auth, isStudent, toggleWishlist);

export default router;
