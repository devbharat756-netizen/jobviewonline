import mongoose from "mongoose";

const companyDetailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
    },
    industry: {
      type: String,
      default: "",
    },
    founded: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const freelanceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    companyLogo: {
      type: String,
      default: "",
    },

    salary: {
      type: String,
      default: "",
    },

    salaryMin: {
      type: Number,
      default: 0,
    },

    salaryMax: {
      type: Number,
      default: 0,
    },

    experience: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "",
    },

    mode: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      default: "",
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    requirements: {
      type: [String],
      default: [],
    },

    postedDate: {
      type: Date,
      default: Date.now,
    },

    published: {
      type: Boolean,
      default: true,
    },

    companyDetails: {
      type: companyDetailsSchema,
      default: () => ({}),
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Freelance", freelanceSchema);
