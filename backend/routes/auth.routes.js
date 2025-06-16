//backend/routes/auth.routes.js
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  signupUser,
  loginUser,
  googleAuth,
  googleAuthRedirect,
} from "../controllers/auth.controller.js";
import "../config/passport.js";
import User from "../models/user.model.js";

const router = express.Router();

// Signup Route
router.post("/signup", signupUser);

// Login Route
router.post("/login", loginUser);

// Google OAuth Routes
router.get("/auth/google", googleAuth);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleAuthRedirect
);

// Get current user
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
