import mongoose from "mongoose";

const jobApplicantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost",
      required: true,
      index: true,
    },
 
    resumePath: {
      type: String,
      required: true,
      trim: true,
    },
    keywordsValues: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    matchedScore: {
      type: Number,
      default: 0,
    },
    portfolioLink: {
      type: String,
      default: null,
      trim: true,
    },
    fullName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    coverLetter: {
      type: String,
      default: null,
    },
    linkedIn: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "rejected"],
      default: "pending",
      index: true,
    },
    statusHistory: [
      {
        status: { type: String, enum: ["pending", "shortlisted", "rejected"] },
        updatedAt: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
      }
    ],
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
    collection: "job_applicants",
  }
);

jobApplicantSchema.index({ jobId: 1, userId: 1 }, { unique: true });

const JobApplicant =
  mongoose.models.JobApplicant || mongoose.model("JobApplicant", jobApplicantSchema);

export default JobApplicant;