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
} from "../controllers/job.controller.js";
import { protect, restrictTo, optionalProtect } from "../../../middleware/auth.middleware.js";
import { uploadResume } from "../../../middleware/upload.middleware.js";

const router = Router();

router.post("/", createJob);

router.get("/", getJobs);

// Personal candidate saved/applied jobs list endpoints (mounted before /:id)
router.get("/saved", protect, restrictTo("candidate"), getSavedJobs);
router.get("/applied", protect, restrictTo("candidate"), getAppliedJobs);

router.get("/resume-proxy", resumeProxy);
router.get("/admin/applications", getAdminApplications);
router.put("/admin/applications/:id/status", updateApplicationStatus);

router.get("/:id", optionalProtect, getJobById);

router.put("/:id", updateJob);

router.delete("/:id", deleteJob);

router.patch("/:id/publish", togglePublish);

router.post("/:id/apply", optionalProtect, uploadResume, applyJob);
router.post("/:id/save", protect, restrictTo("candidate"), toggleSaveJob);

export default router;