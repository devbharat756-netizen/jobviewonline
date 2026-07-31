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
} from "../controllers/freelance.controller.js";
import { optionalProtect } from "../../../middleware/auth.middleware.js";
import { uploadResume } from "../../../middleware/upload.middleware.js";

const router = Router();

router.post("/", createFreelance);
router.get("/", getFreelanceProjects);

router.get("/admin/applications", getAdminFreelanceApplications);
router.put("/admin/applications/:id/status", updateFreelanceApplicationStatus);

router.get("/:id", optionalProtect, getFreelanceProjectById);
router.put("/:id", updateFreelanceProject);
router.delete("/:id", deleteFreelanceProject);
router.patch("/:id/publish", togglePublishFreelance);
router.post("/:id/apply", optionalProtect, uploadResume, applyFreelance);

export default router;
