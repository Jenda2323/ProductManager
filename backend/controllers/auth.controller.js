//backend/controllers/auth.controller.js - Kontroler pro autentizaci
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/user.model.js";
import "../config/passport.js"; // Import konfigurace passport

const JWT_SECRET = process.env.JWT_SECRET;

// Kontroler pro běžnou registraci
export const signupUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });
    res.status(201).json({ message: "Registrace úspěšná" });
  } catch (error) {
    res.status(400).json({ message: "Uživatel již existuje" });
  }
};

// Kontroler pro běžné přihlášení
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Uživatel nebyl nalezen" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Neplatné přihlašovací údaje" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Chyba serveru" });
  }
};

// Google OAuth cesta
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  callbackURL:
    "https://findproducts-backend.onrender.com/api/users/auth/google/callback",
});

// Google OAuth callback cesta
export const googleAuthRedirect = (req, res) => {
  try {
    console.log("Google auth callback - Uživatel:", req.user);

    if (!req.user) {
      console.error("Žádný uživatel v požadavku");
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
    }

    // Vytvoření JWT tokenu
    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log("Vygenerovaný token pro uživatele:", req.user._id);

    // Přesměrování na frontend s tokenem (bez index.html)
    const frontendUrl = process.env.FRONTEND_URL.replace("/index.html", "");
    res.redirect(`${frontendUrl}?token=${token}`);
  } catch (error) {
    console.error("Chyba v googleAuthRedirect:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};
