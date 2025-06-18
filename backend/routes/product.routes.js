import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Veřejné cesty
router.get("/", getProducts); // Zobrazení všech produktů bez autentizace

// Chráněné cesty
router.post("/", authenticate, createProduct); // Pouze přihlášení uživatelé mohou přidávat produkty
router.put("/:id", authenticate, updateProduct); // Pouze přihlášení uživatelé mohou upravovat
router.delete("/:id", authenticate, deleteProduct); // Pouze přihlášení uživatelé mohou mazat

export default router;
