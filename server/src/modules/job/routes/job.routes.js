import { Router } from "express";

import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  togglePublish,
  applyJob,
  toggleSaveJob,
  getSavedJobs,
  getAppliedJobs,
  getAdminApplications,
  updateApplicationStatus,
  resumeProxy,
  getRecruiterListings,
  getRecruiterApplications,
  updateApplicationStatusByRecruiter,
  approveJob,
  rejectJob,
} from "../controllers/job.controller.js";
import { protect, restrictTo, optionalProtect } from "../../../middleware/auth.middleware.js";
import { uploadResume } from "../../../middleware/upload.middleware.js";
import { validateJobPost, validateApplication, validateStatus } from "../validation/job.validation.js";

const router = Router();

router.post("/", protect, restrictTo("recruiter", "admin"), validateJobPost, createJob);

router.get("/", optionalProtect, getJobs);

// Recruiter endpoints (mounted before parameters to prevent route collisions)
router.get("/recruiter/listings", protect, restrictTo("recruiter"), getRecruiterListings);
router.get("/recruiter/applications", protect, restrictTo("recruiter"), getRecruiterApplications);
router.put("/recruiter/applications/:id/status", protect, restrictTo("recruiter"), validateStatus, updateApplicationStatusByRecruiter);

// Personal candidate saved/applied jobs list endpoints (mounted before /:id)
router.get("/saved", protect, restrictTo("candidate"), getSavedJobs);
router.get("/applied", protect, restrictTo("candidate"), getAppliedJobs);

router.get("/resume-proxy", resumeProxy);
router.get("/admin/applications", protect, restrictTo("admin"), getAdminApplications);
router.put("/admin/applications/:id/status", protect, restrictTo("admin"), validateStatus, updateApplicationStatus);

// Approval actions (restricted to admins)
router.patch("/:id/approve", protect, restrictTo("admin"), approveJob);
router.patch("/:id/reject", protect, restrictTo("admin"), rejectJob);

router.get("/:id", optionalProtect, getJobById);

router.put("/:id", protect, restrictTo("recruiter", "admin"), validateJobPost, updateJob);

router.delete("/:id", protect, restrictTo("recruiter", "admin"), deleteJob);

router.patch("/:id/publish", protect, restrictTo("recruiter", "admin"), togglePublish);

router.post("/:id/apply", optionalProtect, uploadResume, validateApplication, applyJob);
router.post("/:id/save", protect, restrictTo("candidate"), toggleSaveJob);

export default router;