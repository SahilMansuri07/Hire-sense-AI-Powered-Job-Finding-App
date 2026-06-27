import mongoose from "mongoose";

const jobPostSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Basic Info
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      enum: ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Other"],
      type: String,
      default: null,
      required: true,
    },

    location: {
      type: String,
      default: null,
      trim: true,
    },

    latitude: {
      type: String,
      default: null,
    },

    longitude: {
      type: String,
      default: null,
    },

    employmentType: {
      type: String, // Full-time, Part-time, Contract, Internship
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },

    job_type : {
      enum: ["on-site", "remote", "hybrid"],
      type: String,
      default: "on-site",
    },

    salaryRange: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
    },

    // Skills Section
    requiredSkills: {
      type: [String],
      default: [],
      index: true, // useful for filtering/search
    },

    // Job Description Section
    jobDescription: {
      description: {
        type: String,
        default: "",
      },
      requirements: {
        type: String,
        default: "",
      },
      benefits: {
        type: String,
        default: "",
      },
    },

    // AI Enhancement (important for your system)
    aiGenerated: {
      type: Boolean,
      default: false,
    },

    // Job Status
    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "draft",
      index: true,
    },

    // Soft flags (same as your pattern)
    is_active: {
      type: Boolean,
      default: true,
    },

    is_delete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    collection: "job_posts",
  }
);

const JobPost =
  mongoose.models.JobPost || mongoose.model("JobPost", jobPostSchema);

export default JobPost;