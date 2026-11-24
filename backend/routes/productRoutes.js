import express from "express";

import {
  getProducts,
  getPublicProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public menu
router.get("/public", getPublicProducts);

// Admin routes
router.get("/", authMiddleware, getProducts);
router.post("/", authMiddleware, addProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;