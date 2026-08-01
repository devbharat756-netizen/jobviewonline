import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
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

// Prevent duplicate applications by same user for same job (enforced only for authenticated users)
applicationSchema.index(
  { user: 1, job: 1 },
  { 
    unique: true, 
    partialFilterExpression: { user: { $type: "objectId" } } 
  }
);

// Index on job for counting applicants and querying by job efficiently
applicationSchema.index({ job: 1 });

export default mongoose.model("Application", applicationSchema);
