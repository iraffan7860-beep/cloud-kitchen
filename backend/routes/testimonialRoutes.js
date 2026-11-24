import express from "express";

import {
  getPublicTestimonials,
  getAdminTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial
} from "../controllers/testimonialController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer routes
router.get("/public", getPublicTestimonials);
router.post("/", addTestimonial);

// Protected admin routes
router.get("/", authMiddleware, getAdminTestimonials);
router.put("/:id", authMiddleware, updateTestimonial);
router.delete("/:id", authMiddleware, deleteTestimonial);

export default router;