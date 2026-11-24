import express from "express";

import {
  getPublicSettings,
  getAdminSettings,
  updateSettings
} from "../controllers/settingsController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/public", getPublicSettings);

router.get("/", authMiddleware, getAdminSettings);

router.put("/", authMiddleware, updateSettings);

export default router;