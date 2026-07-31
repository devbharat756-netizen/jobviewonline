import { Router } from "express";
import {
  signupCandidate,
  loginCandidate,
  getMe,
  updateProfile,
  subscribeNewsletter,
  getNewsletterSubscribers,
  removeNewsletterSubscriber,
} from "../controllers/user.controller.js";
import { protect, restrictTo } from "../../../middleware/auth.middleware.js";
import { uploadProfileFiles } from "../../../middleware/profileUpload.middleware.js";

const router = Router();

// Dedicated Login & Signup routes
router.post("/candidate/signup", signupCandidate);
router.post("/candidate/login", loginCandidate);

// Newsletter subscription
router.post("/newsletter/subscribe", subscribeNewsletter);
router.get("/newsletter/subscribers", getNewsletterSubscribers);
router.delete("/newsletter/subscribers/:id", removeNewsletterSubscriber);

// Session check
router.get("/me", protect, getMe);

// Profile management route
router.put("/profile", protect, restrictTo("candidate"), uploadProfileFiles, updateProfile);

export default router;
