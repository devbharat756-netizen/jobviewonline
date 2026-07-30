import { Router } from "express";
import {
  signupCandidate,
  loginCandidate,
  getMe,
  updateProfile,
} from "../controllers/user.controller.js";
import { protect, restrictTo } from "../../../middleware/auth.middleware.js";
import { uploadProfileFiles } from "../../../middleware/profileUpload.middleware.js";

const router = Router();

// Dedicated Login & Signup routes
router.post("/candidate/signup", signupCandidate);
router.post("/candidate/login", loginCandidate);

// Session check
router.get("/me", protect, getMe);

// Profile management route
router.put("/profile", protect, restrictTo("candidate"), uploadProfileFiles, updateProfile);

export default router;
