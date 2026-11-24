import express from "express";

import {
  getCategories,
  getPublicCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/public", getPublicCategories);

router.get("/", authMiddleware, getCategories);
router.post("/", authMiddleware, addCategory);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);

export default router;