import { Router } from "express";
import {
  createFreelance,
  getFreelanceProjects,
  getFreelanceProjectById,
  updateFreelanceProject,
  deleteFreelanceProject,
  togglePublishFreelance,
  applyFreelance,
  getAdminFreelanceApplications,
  updateFreelanceApplicationStatus,
  approveFreelanceProject,
  rejectFreelanceProject,
} from "../controllers/freelance.controller.js";
import { protect, restrictTo, optionalProtect } from "../../../middleware/auth.middleware.js";
import { uploadResume } from "../../../middleware/upload.middleware.js";
import { validateJobPost, validateApplication, validateStatus } from "../validation/job.validation.js";

const router = Router();

router.post("/", protect, restrictTo("recruiter", "admin"), validateJobPost, createFreelance);
router.get("/", optionalProtect, getFreelanceProjects);

router.get("/admin/applications", protect, restrictTo("admin"), getAdminFreelanceApplications);
router.put("/admin/applications/:id/status", protect, restrictTo("admin"), validateStatus, updateFreelanceApplicationStatus);

// Approval actions (restricted to admins)
router.patch("/:id/approve", protect, restrictTo("admin"), approveFreelanceProject);
router.patch("/:id/reject", protect, restrictTo("admin"), rejectFreelanceProject);

router.get("/:id", optionalProtect, getFreelanceProjectById);
router.put("/:id", protect, restrictTo("recruiter", "admin"), validateJobPost, updateFreelanceProject);
router.delete("/:id", protect, restrictTo("recruiter", "admin"), deleteFreelanceProject);
router.patch("/:id/publish", protect, restrictTo("recruiter", "admin"), togglePublishFreelance);
router.post("/:id/apply", optionalProtect, uploadResume, validateApplication, applyFreelance);

export default router;

