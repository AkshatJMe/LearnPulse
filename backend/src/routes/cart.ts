import express from "express";
import { auth, isStudent } from "../middlewares/auth.js";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/cart.js";

const router = express.Router();

// ================ Cart Routes ================

// Get user cart
router.get("/", auth, isStudent, getCart);

// Add course to cart
router.post("/add", auth, isStudent, addToCart);

// Remove course from cart
router.delete("/remove", auth, isStudent, removeFromCart);

// Clear cart
router.delete("/clear", auth, isStudent, clearCart);

export default router;
