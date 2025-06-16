//backend/controllers/auth.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/user.model.js";
import "../config/passport.js"; // Import passport configuration

const JWT_SECRET = process.env.JWT_SECRET;

// Regular Signup Controller
export const signupUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    res.status(400).json({ message: "User already exists" });
  }
};

// Regular Login Controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Google OAuth route
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Google OAuth callback route
export const googleAuthRedirect = (req, res) => {
  try {
    console.log("Google auth callback - User:", req.user);

    if (!req.user) {
      console.error("No user in request");
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
    }

    // Create JWT token
    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log("Generated token for user:", req.user._id);

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  } catch (error) {
    console.error("Error in googleAuthRedirect:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};
