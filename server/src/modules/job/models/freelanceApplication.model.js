import mongoose from "mongoose";

const freelanceApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    freelance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Freelance",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    expectedSalary: {
      type: String,
      required: true,
      trim: true,
    },
    currentSalary: {
      type: String,
      trim: true,
    },
    yearsOfExperience: {
      type: String,
      required: true,
    },
    noticePeriod: {
      type: String,
      required: true,
    },
    availability: {
      type: String,
      required: true,
    },
    relocation: {
      type: String,
      enum: ["yes", "no", "negotiable"],
      default: "no",
    },
    linkedIn: {
      type: String,
      trim: true,
    },
    portfolio: {
      type: String,
      trim: true,
    },
    coverLetter: {
      type: String,
      trim: true,
    },
    resume: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      default: "Applied",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications by same user for same freelance project (enforced only for authenticated users)
freelanceApplicationSchema.index(
  { user: 1, freelance: 1 },
  { 
    unique: true, 
    partialFilterExpression: { user: { $exists: true, $ne: null } } 
  }
);

export default mongoose.model("FreelanceApplication", freelanceApplicationSchema);
