import Freelance from "../models/freelance.model.js";
import FreelanceApplication from "../models/freelanceApplication.model.js";
import { uploadToCloudinary } from "../../../utils/cloudinary.js";

export const createFreelance = async (req, res) => {
  try {
    const freelanceData = {
      ...req.body,
      postedBy: req.user?._id || null,
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
    const projects = await Freelance.find().sort({ createdAt: -1 });
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

    let isApplied = false;
    if (req.user) {
      isApplied = await FreelanceApplication.exists({ user: req.user._id, freelance: project._id }) !== null;
    }

    const totalApplicantCount = await FreelanceApplication.countDocuments({ freelance: project._id });
    const projectData = project.toObject();
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

    Object.assign(project, req.body);
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
      .populate("freelance")
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
