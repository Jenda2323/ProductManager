//server.js - Hlavní server soubor
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";

// Získání aktuálního adresáře
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Načtení proměnných prostředí
console.log("Environment variables loaded:", {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Not set",
  JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Not set",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set",
  FRONTEND_URL: process.env.FRONTEND_URL ? "Set" : "Not set",
});

const app = express();
const PORT = process.env.PORT || 5000;

// Připojení k MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Zvýšení limitu velikosti dat
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hodin
    },
  })
);

// Inicializace Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware pro zpracování chyb
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Něco se pokazilo!");
});

// Cesty
app.use("/api/users", authRoutes);
app.use("/api/products", productRoutes);

// Obsluha statických souborů z React aplikace
if (process.env.NODE_ENV === "development") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
  });
}

// Spuštění serveru
app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
  console.log("Environment variables:", {
    NODE_ENV: process.env.NODE_ENV,
    FRONTEND_URL: process.env.FRONTEND_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set",
  });
});
