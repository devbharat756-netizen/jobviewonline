import Job from "../models/job.model.js";
import Application from "../models/application.model.js";
import SavedJob from "../models/savedJob.model.js";
import FreelanceApplication from "../models/freelanceApplication.model.js";
import Freelance from "../models/freelance.model.js";
import { uploadToCloudinary, getSignedCloudinaryUrl } from "../../../utils/cloudinary.js";
import https from "https";

export const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user?._id || null,
    };
    const job = await Job.create(jobData);

    return res.status(201).json({
      success: true,
      message: "Job created successfully.",
      data: job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    let isApplied = false;
    let isSaved = false;

    if (req.user) {
      isApplied = await Application.exists({ user: req.user._id, job: job._id }) !== null;
      isSaved = await SavedJob.exists({ user: req.user._id, job: job._id }) !== null;
    }

    const totalApplicantCount = await Application.countDocuments({ job: job._id });

    const jobData = job.toObject();
    jobData.isApplied = isApplied;
    jobData.isSaved = isSaved;
    jobData.totalApplicantCount = totalApplicantCount;

    return res.json({
      success: true,
      data: jobData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    if (req.user && req.user.role === "recruiter") {
      if (!job.postedBy || job.postedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You can only edit your own listings.",
        });
      }
    }

    Object.assign(job, req.body);
    await job.save();

    return res.json({
      success: true,
      message: "Job updated successfully.",
      data: job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    if (req.user && req.user.role === "recruiter") {
      if (!job.postedBy || job.postedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You can only delete your own listings.",
        });
      }
    }

    await Job.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: "Job deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    if (req.user && req.user.role === "recruiter") {
      if (!job.postedBy || job.postedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You can only publish/unpublish your own listings.",
        });
      }
    }

    job.published = !job.published;
    await job.save();

    return res.json({
      success: true,
      message: "Publish status updated.",
      data: job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const applyJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || null;

    // Verify user role if authenticated
    if (req.user && req.user.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Access forbidden. Only candidate users can apply for jobs.",
      });
    }

    // Verify job existence
    const jobExists = await Job.findById(id);
    if (!jobExists) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // Prevent duplicate application by this user if logged in
    if (userId) {
      const duplicateApp = await Application.findOne({ user: userId, job: id });
      if (duplicateApp) {
        return res.status(400).json({
          success: false,
          message: "You have already applied for this job.",
        });
      }
    }

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

    // Backend Form Validations
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: "Full name is required." });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email." });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: "Phone number is required." });
    }
    if (!yearsOfExperience) {
      return res.status(400).json({ success: false, message: "Years of experience is required." });
    }
    if (!expectedSalary || !expectedSalary.trim()) {
      return res.status(400).json({ success: false, message: "Expected salary is required." });
    }
    if (!noticePeriod || !noticePeriod.trim()) {
      return res.status(400).json({ success: false, message: "Notice period is required." });
    }
    if (!availability) {
      return res.status(400).json({ success: false, message: "Availability date/time selection is required." });
    }

    // Handle resume file validation
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file (PDF) is required.",
      });
    }

    // Upload to Cloudinary
    let uploadResult;
    try {
      uploadResult = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError);
      return res.status(500).json({
        success: false,
        message: "Failed to upload resume to Cloudinary. Please check configuration or try again.",
      });
    }

    // Save Application in database
    const application = await Application.create({
      user: userId,
      job: id,
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
    console.error("Apply Job Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during application process.",
    });
  }
};

export const toggleSaveJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Verify user role
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Access forbidden. Only candidate users can save jobs.",
      });
    }

    // Verify job existence
    const jobExists = await Job.findById(id);
    if (!jobExists) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    const existingSave = await SavedJob.findOne({ user: userId, job: id });

    if (existingSave) {
      // Unsave
      await SavedJob.findByIdAndDelete(existingSave._id);
      return res.status(200).json({
        success: true,
        isSaved: false,
        message: "Job removed from saved list.",
      });
    } else {
      // Save
      await SavedJob.create({
        user: userId,
        job: id,
      });
      return res.status(200).json({
        success: true,
        isSaved: true,
        message: "Job saved successfully!",
      });
    }
  } catch (error) {
    console.error("Toggle Save Job Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while saving/unsaving the job.",
    });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch saved jobs and populate job details
    const savedRecords = await SavedJob.find({ user: userId })
      .populate("job")
      .sort({ createdAt: -1 });

    // Filter out populated jobs that might have been deleted from DB
    const validSavedJobs = savedRecords
      .filter(record => record.job !== null)
      .map(record => {
        const jobObj = record.job.toObject();
        jobObj.id = jobObj._id; // Add standard id mapping for client UI compatibility
        return jobObj;
      });

    return res.status(200).json({
      success: true,
      count: validSavedJobs.length,
      data: validSavedJobs,
    });
  } catch (error) {
    console.error("Get Saved Jobs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching saved jobs.",
    });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch applications and populate job details
    const applications = await Application.find({ user: userId })
      .populate("job")
      .sort({ createdAt: -1 });

    const appliedJobListings = applications
      .filter(app => app.job !== null)
      .map(app => {
        return {
          id: app._id,
          jobId: app.job._id,
          jobTitle: app.job.title,
          company: app.job.company,
          companyLogo: app.job.companyLogo,
          appliedAt: app.createdAt,
          status: app.status,
          isFreelance: false,
        };
      });

    // Fetch freelance applications and populate project details
    const freelanceApplications = await FreelanceApplication.find({ user: userId })
      .populate("freelance")
      .sort({ createdAt: -1 });

    const freelanceAppliedListings = freelanceApplications
      .filter(app => app.freelance !== null)
      .map(app => {
        return {
          id: app._id,
          jobId: app.freelance._id,
          jobTitle: app.freelance.title,
          company: app.freelance.company || "Freelance Project",
          companyLogo: app.freelance.companyLogo,
          appliedAt: app.createdAt,
          status: app.status,
          isFreelance: true,
        };
      });

    // Combine both arrays and sort by appliedAt descending
    const allApplied = [...appliedJobListings, ...freelanceAppliedListings]
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    return res.status(200).json({
      success: true,
      count: allApplied.length,
      data: allApplied,
    });
  } catch (error) {
    console.error("Get Applied Jobs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching applied jobs.",
    });
  }
};

export const getAdminApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job")
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
      job: app.job ? {
        _id: app.job._id,
        title: app.job.title,
        company: app.job.company,
        location: app.job.location,
        salary: app.job.salary,
      } : null,
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error("Get Admin Applications Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching applications.",
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Status updated to ${status} successfully.`,
      data: application,
    });
  } catch (error) {
    console.error("Update Application Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error updating application status.",
    });
  }
};

export const resumeProxy = (req, res) => {
  try {
    const { url, publicId, resourceType } = req.query;

    let targetUrl = url;

    // If we have publicId, generate a signed URL using SDK credentials to bypass security blocks
    if (publicId) {
      const type = resourceType || (publicId.includes("resumes") ? "raw" : "image");
      targetUrl = getSignedCloudinaryUrl(publicId, type);
    } else if (url) {
      // Parse publicId and resourceType from legacy URLs
      const parts = url.split("/upload/");
      if (parts.length === 2) {
        const pathPart = parts[1];
        const pathWithoutVersion = pathPart.replace(/^v\d+\//, "");
        const rawType = url.includes("/raw/upload/") ? "raw" : "image";
        targetUrl = getSignedCloudinaryUrl(pathWithoutVersion, rawType);
      }
    }

    if (!targetUrl) {
      return res.status(400).send("No target URL or public ID provided.");
    }

    https.get(targetUrl, (cloudinaryResponse) => {
      // If Cloudinary returned an error status, pass it along as plain text to show the error message
      if (cloudinaryResponse.statusCode >= 400) {
        res.status(cloudinaryResponse.statusCode);
        res.setHeader("Content-Type", "text/plain");
        return cloudinaryResponse.pipe(res);
      }

      // Check if redirect
      if (cloudinaryResponse.statusCode >= 300 && cloudinaryResponse.statusCode < 400 && cloudinaryResponse.headers.location) {
        return https.get(cloudinaryResponse.headers.location, (redirectResponse) => {
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Content-Disposition", "inline; filename=\"resume.pdf\"");
          redirectResponse.pipe(res);
        }).on("error", (err) => {
          console.error("Resume Proxy Redirect Error:", err.message);
          res.status(500).send("Failed to retrieve document.");
        });
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=\"resume.pdf\"");
      cloudinaryResponse.pipe(res);
    }).on("error", (err) => {
      console.error("Resume Proxy Request Error:", err.message);
      res.status(500).send("Failed to retrieve document.");
    });
  } catch (error) {
    console.error("Resume Proxy Exception:", error.message);
    res.status(500).send("Internal server error in resume proxy.");
  }
};

export const getRecruiterListings = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobs = await Job.find({ postedBy: userId }).sort({ createdAt: -1 });
    const freelance = await Freelance.find({ postedBy: userId }).sort({ createdAt: -1 });

    const combined = [
      ...jobs.map(j => ({ ...j.toObject(), id: j._id, isFreelance: false })),
      ...freelance.map(f => ({ ...f.toObject(), id: f._id, isFreelance: true }))
    ].sort((a, b) => b.createdAt - a.createdAt);

    return res.status(200).json({
      success: true,
      count: combined.length,
      data: combined
    });
  } catch (error) {
    console.error("Get Recruiter Listings Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching your listings."
    });
  }
};

export const getRecruiterApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const userJobs = await Job.find({ postedBy: userId }).select("_id");
    const userFreelance = await Freelance.find({ postedBy: userId }).select("_id");

    const jobIds = userJobs.map(j => j._id);
    const freelanceIds = userFreelance.map(f => f._id);

    const jobApps = await Application.find({ job: { $in: jobIds } })
      .populate("job")
      .sort({ createdAt: -1 });

    const freelanceApps = await FreelanceApplication.find({ freelance: { $in: freelanceIds } })
      .populate("freelance")
      .sort({ createdAt: -1 });

    const combined = [
      ...jobApps.map(app => ({
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
        jobTitle: app.job?.title || "N/A",
        company: app.job?.company || "N/A",
        isFreelance: false,
        jobId: app.job?._id,
        appliedAt: app.createdAt
      })),
      ...freelanceApps.map(app => ({
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
        jobTitle: app.freelance?.title || "N/A",
        company: app.freelance?.company || "N/A",
        isFreelance: true,
        jobId: app.freelance?._id,
        appliedAt: app.createdAt
      }))
    ].sort((a, b) => b.appliedAt - a.appliedAt); // Sort ascending or descending, usually descending for recent

    return res.status(200).json({
      success: true,
      count: combined.length,
      data: combined
    });
  } catch (error) {
    console.error("Get Recruiter Applications Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching candidate applications."
    });
  }
};

export const updateApplicationStatusByRecruiter = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    let application = await Application.findById(id).populate("job");
    let isFreelance = false;

    if (!application) {
      application = await FreelanceApplication.findById(id).populate("freelance");
      isFreelance = true;
    }

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found."
      });
    }

    const jobOwnerId = isFreelance ? application.freelance?.postedBy : application.job?.postedBy;
    if (!jobOwnerId || jobOwnerId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only update statuses of candidates applying to your own listings."
      });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Candidate application status updated successfully.",
      data: application
    });
  } catch (error) {
    console.error("Update Application Status Recruiter Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error updating candidate status."
    });
  }
};