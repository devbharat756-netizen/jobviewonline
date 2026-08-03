import User from "../models/user.model.js";
import Newsletter from "../models/newsletter.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { uploadToCloudinary } from "../../../utils/cloudinary.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing");
}

/**
 * Generates a signed JWT token.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

/**
 * Registers a new candidate.
 */
export const signupCandidate = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Field Validations
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Full Name is required." });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;

    if (!phone || !phoneRegex.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit phone number.",
      });
    }

    // Check duplicate email
    const emailExists = await User.findOne({ email: normalizedEmail });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const targetRole = role && ["candidate", "recruiter"].includes(role) ? role : "candidate";

    // Create user record
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: hashedPassword,
      role: targetRole,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Candidate account created successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup Candidate Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred during registration.",
    });
  }
};

/**
 * Authenticates a candidate using email and password.
 */
export const loginCandidate = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find candidate by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const targetRole = role && ["candidate", "recruiter", "admin"].includes(role) ? role : "candidate";

    // Verify role matches selection
    if (user.role !== targetRole) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: This login screen is restricted to ${targetRole === 'candidate' ? 'candidates' : targetRole === 'recruiter' ? 'employers' : 'admins'}.`,
      });
    }

    // Verify password hash
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        about: user.about,
        skills: user.skills,
        education: user.education,
        experience: user.experience,
        portfolio: user.portfolio,
        github: user.github,
        linkedin: user.linkedin,
        avatar: user.avatar,
        resume: user.resume,
      },
    });
  } catch (error) {
    console.error("Login Candidate Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred during login.",
    });
  }
};

/**
 * Returns authenticated user details.
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        about: user.about,
        skills: user.skills,
        education: user.education,
        experience: user.experience,
        portfolio: user.portfolio,
        github: user.github,
        linkedin: user.linkedin,
        avatar: user.avatar,
        resume: user.resume,
      },
    });
  } catch (error) {
    console.error("GetMe controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching user session.",
    });
  }
};

/**
 * Updates candidate profile. Handles text updates and uploads file buffers dynamically to Cloudinary.
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const {
      name,
      phone,
      address,
      about,
      skills,
      education,
      experience,
      portfolio,
      github,
      linkedin,
    } = req.body;

    // Validate email cannot be updated easily (for safety/reliability)
    if (name && name.trim()) {
      user.name = name.trim();
    }
    if (phone !== undefined) {
      const phoneRegex = /^[0-9]{10}$/;

      if (!phoneRegex.test(phone.trim())) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid 10-digit phone number.",
        });
      }

      user.phone = phone.trim();
    }
    if (address !== undefined) {
      user.address = address.trim();
    }
    if (about !== undefined) {
      user.about = about.trim();
    }
    if (portfolio !== undefined) {
      user.portfolio = portfolio.trim();
    }
    if (github !== undefined) {
      user.github = github.trim();
    }
    if (linkedin !== undefined) {
      user.linkedin = linkedin.trim();
    }

    // Parse array variables if they are passed as JSON strings (common in FormData requests)
    if (skills !== undefined) {
      try {
        user.skills = typeof skills === "string" ? JSON.parse(skills) : skills;
      } catch (err) {
        user.skills = Array.isArray(skills) ? skills : [skills];
      }
    }
    if (education !== undefined) {
      try {
        user.education = typeof education === "string" ? JSON.parse(education) : education;
      } catch (err) {
        console.warn("Could not parse education data.", err.message);
      }
    }
    if (experience !== undefined) {
      try {
        user.experience = typeof experience === "string" ? JSON.parse(experience) : experience;
      } catch (err) {
        console.warn("Could not parse experience data.", err.message);
      }
    }

    // Handle files upload to Cloudinary if sent in request
    if (req.files) {
      // Handle Avatar Image upload
      if (req.files.avatar && req.files.avatar[0]) {
        const avatarFile = req.files.avatar[0];
        try {
          const avatarResult = await uploadToCloudinary(
            avatarFile.buffer,
            avatarFile.originalname,
            "jobviewonline/avatars",
            "image"
          );
          user.avatar = avatarResult.secure_url;
        } catch (avatarError) {
          console.error("Avatar upload failed:", avatarError.message);
          return res.status(500).json({
            success: false,
            message: "Failed to upload avatar image to Cloud Storage.",
          });
        }
      }

      // Handle Resume PDF upload
      if (req.files.resume && req.files.resume[0]) {
        const resumeFile = req.files.resume[0];
        try {
          const resumeResult = await uploadToCloudinary(
            resumeFile.buffer,
            resumeFile.originalname,
            "jobviewonline/resumes",
            "raw"
          );
          user.resume = `${req.protocol}://${req.get("host")}/api/jobs/resume-proxy?publicId=${encodeURIComponent(resumeResult.public_id)}&url=${encodeURIComponent(resumeResult.secure_url)}`;
        } catch (resumeError) {
          console.error("Resume upload failed:", resumeError.message);
          return res.status(500).json({
            success: false,
            message: "Failed to upload resume document to Cloud Storage.",
          });
        }
      }
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        about: user.about,
        skills: user.skills,
        education: user.education,
        experience: user.experience,
        portfolio: user.portfolio,
        github: user.github,
        linkedin: user.linkedin,
        avatar: user.avatar,
        resume: user.resume,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while updating profile.",
    });
  }
};

// Deprecated backup helper (from previous migration setup)
export const registerOrLoginCandidate = async (req, res) => {
  return res.status(410).json({
    success: false,
    message: "This endpoint has been deprecated. Please use dedicated signup and login screens instead.",
  });
};

/**
 * Subscribes a user's email to the newsletter.
 */
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(200).json({ success: true, message: "You are already subscribed to our newsletter!" });
    }

    await Newsletter.create({ email: normalizedEmail });
    return res.status(201).json({ success: true, message: "Thank you for subscribing to our newsletter!" });
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

/**
 * Retrieves all newsletter subscribers.
 */
export const getNewsletterSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: subscribers });
  } catch (err) {
    console.error("Fetch subscribers error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

/**
 * Removes a newsletter subscriber.
 */
export const removeNewsletterSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    await Newsletter.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Subscriber removed successfully." });
  } catch (err) {
    console.error("Remove subscriber error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};
