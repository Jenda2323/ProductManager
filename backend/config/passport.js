import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import dotenv from "dotenv";

// Načtení proměnných prostředí
dotenv.config();

// Debug log - Ladící výpis
console.log("Passport config - Proměnné prostředí:", {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "Nastaveno" : "Nenastaveno",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
    ? "Nastaveno"
    : "Nenastaveno",
  FRONTEND_URL: process.env.FRONTEND_URL ? "Nastaveno" : "Nenastaveno",
});

// Kontrola, zda jsou nastaveny požadované proměnné prostředí
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error(
    "Chyba: GOOGLE_CLIENT_ID nebo GOOGLE_CLIENT_SECRET nejsou nastaveny"
  );
  process.exit(1);
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://findproducts-backend.onrender.com/api/users/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Kontrola, zda uživatel existuje
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Vytvoření nového uživatele, pokud neexistuje
          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            picture: profile.photos[0].value,
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
