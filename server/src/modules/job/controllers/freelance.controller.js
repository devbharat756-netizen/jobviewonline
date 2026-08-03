import Freelance from "../models/freelance.model.js";
import FreelanceApplication from "../models/freelanceApplication.model.js";
import AuditLog from "../../admin/models/auditLog.model.js";
import { uploadToCloudinary } from "../../../utils/cloudinary.js";

export const createFreelance = async (req, res) => {
  try {
    const status = req.user && req.user.role === "admin" ? "approved" : "pending";
    const freelanceData = {
      ...req.body,
      postedBy: req.user?._id || null,
      status,
    };
    const freelance = await Freelance.create(freelanceData);
    return res.status(201).json({
      success: true,
      message: "Freelance project created successfully.",
      data: freelance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFreelanceProjects = async (req, res) => {
  try {
    let query = {};
    const isAdmin = req.user && req.user.role === "admin";

    if (!isAdmin) {
      query = { status: "approved", published: true };
    }

    let projectsQuery = Freelance.find(query).sort({ createdAt: -1 });

    if (!isAdmin) {
      // Expose only candidate-facing fields to prevent sensitive data leakage
      projectsQuery = projectsQuery.select(
        "title company companyLogo salary salaryMin salaryMax experience location type mode category skills description responsibilities requirements postedDate published companyDetails status"
      );
    }

    const projects = await projectsQuery;

    return res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFreelanceProjectById = async (req, res) => {
  try {
    const project = await Freelance.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Freelance project not found.",
      });
    }

    // Resource Enumeration protection: return 404 if not approved/published, unless owner or admin
    const isOwner = req.user && project.postedBy && project.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === "admin";
    const isAccessible = project.status === "approved" && project.published !== false;

    if (!isAccessible && !isOwner && !isAdmin) {
      return res.status(404).json({
        success: false,
        message: "Freelance project not found.",
      });
    }

    let isApplied = false;
    if (req.user) {
      isApplied = await FreelanceApplication.exists({ user: req.user._id, freelance: project._id }) !== null;
    }

    const totalApplicantCount = await FreelanceApplication.countDocuments({ freelance: project._id });
    const projectData = project.toObject();

    // Prevent exposing poster information/recruiter metadata to standard candidates/guests
    if (!isAdmin) {
      delete projectData.postedBy;
    }

    projectData.isApplied = isApplied;
    projectData.totalApplicantCount = totalApplicantCount;

    return res.json({
      success: true,
      data: projectData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateFreelanceProject = async (req, res) => {
  try {
    const project = await Freelance.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Freelance project not found.",
      });
    }

    if (req.user && req.user.role === "recruiter") {
      if (!project.postedBy || project.postedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You can only edit your own listings.",
        });
      }
    }

    // Preserve status/approval properties unless updated by admin
    const updateData = { ...req.body };
    if (req.user.role !== "admin") {
      delete updateData.status;
    }

    Object.assign(project, updateData);
    await project.save();

    return res.json({
      success: true,
      message: "Freelance project updated successfully.",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteFreelanceProject = async (req, res) => {
  try {
    const project = await Freelance.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Freelance project not found.",
      });
    }

    if (req.user && req.user.role === "recruiter") {
      if (!project.postedBy || project.postedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You can only delete your own listings.",
        });
      }
    }

    // Delete associated applications
    await FreelanceApplication.deleteMany({ freelance: project._id });
    await Freelance.findByIdAndDelete(req.params.id);

    // Audit administrative deletes
    if (req.user && req.user.role === "admin") {
      await AuditLog.create({
        action: "DELETE_PROJECT",
        performedBy: req.user._id,
        targetType: "Freelance",
        targetId: project._id,
        details: `Deleted freelance project "${project.title}" from company "${project.company}"`,
        ipAddress: req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "",
      });
    }

    return res.json({
      success: true,
      message: "Freelance project deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveFreelanceProject = async (req, res) => {
  try {
    const project = await Freelance.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Freelance project not found.",
      });
    }

    project.status = "approved";
    await project.save();

    await AuditLog.create({
      action: "APPROVE_PROJECT",
      performedBy: req.user._id,
      targetType: "Freelance",
      targetId: project._id,
      details: `Approved freelance project "${project.title}" for company "${project.company}"`,
      ipAddress: req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "",
    });

    return res.json({
      success: true,
      message: "Freelance project approved successfully.",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectFreelanceProject = async (req, res) => {
  try {
    const project = await Freelance.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Freelance project not found.",
      });
    }

    project.status = "rejected";
    await project.save();

    await AuditLog.create({
      action: "REJECT_PROJECT",
      performedBy: req.user._id,
      targetType: "Freelance",
      targetId: project._id,
      details: `Rejected freelance project "${project.title}" for company "${project.company}"`,
      ipAddress: req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "",
    });

    return res.json({
      success: true,
      message: "Freelance project rejected successfully.",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const togglePublishFreelance = async (req, res) => {
  try {
    const project = await Freelance.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Freelance project not found.",
      });
    }

    if (req.user && req.user.role === "recruiter") {
      if (!project.postedBy || project.postedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You can only publish/unpublish your own listings.",
        });
      }
    }

    project.published = !project.published;
    await project.save();

    return res.json({
      success: true,
      message: `Freelance project status set to ${project.published ? 'Published' : 'Draft'}`,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const applyFreelance = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user._id : null;
    const {
      fullName,
      email,
      phone,
      expectedSalary,
      currentSalary,
      yearsOfExperience,
      noticePeriod,
      availability,
      relocation,
      linkedIn,
      portfolio,
      coverLetter,
    } = req.body;

    if (!fullName || !email || !phone || !yearsOfExperience || !noticePeriod || !availability) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required profile application fields.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume document to submit application.",
      });
    }

    // Upload to Cloudinary
    let uploadResult;
    try {
      uploadResult = await uploadToCloudinary(req.file.buffer, req.file.originalname, "jobviewonline/resumes", "raw");
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError);
      return res.status(500).json({
        success: false,
        message: "Failed to upload resume to Cloud storage. Please try again.",
      });
    }

    // Save Application in database
    const application = await FreelanceApplication.create({
      user: userId,
      freelance: id,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      expectedSalary: expectedSalary.trim(),
      currentSalary: currentSalary ? currentSalary.trim() : "",
      yearsOfExperience,
      noticePeriod,
      availability,
      relocation: relocation || "no",
      linkedIn: linkedIn ? linkedIn.trim() : "",
      portfolio: portfolio ? portfolio.trim() : "",
      coverLetter: coverLetter ? coverLetter.trim() : "",
      resume: {
        url: `${req.protocol}://${req.get("host")}/api/jobs/resume-proxy?publicId=${encodeURIComponent(uploadResult.public_id)}&url=${encodeURIComponent(uploadResult.secure_url)}`,
        publicId: uploadResult.public_id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      data: application,
    });
  } catch (error) {
    console.error("Apply Freelance Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAdminFreelanceApplications = async (req, res) => {
  try {
    const applications = await FreelanceApplication.find()
      .populate({
        path: "freelance",
        populate: {
          path: "postedBy",
          select: "role",
        }
      })
      .sort({ createdAt: -1 });

    const formatted = applications.map(app => ({
      _id: app._id,
      fullName: app.fullName,
      email: app.email,
      phone: app.phone,
      expectedSalary: app.expectedSalary,
      currentSalary: app.currentSalary,
      yearsOfExperience: app.yearsOfExperience,
      noticePeriod: app.noticePeriod,
      availability: app.availability,
      relocation: app.relocation,
      linkedIn: app.linkedIn,
      portfolio: app.portfolio,
      coverLetter: app.coverLetter,
      resume: app.resume,
      status: app.status,
      createdAt: app.createdAt,
      postedByRole: app.freelance?.postedBy?.role || "admin",
      job: app.freelance, // Aliased for client compatibility
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error("Get Admin Freelance Applications Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateFreelanceApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const application = await FreelanceApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully.",
      data: application,
    });
  } catch (error) {
    console.error("Update Freelance Application Status Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
