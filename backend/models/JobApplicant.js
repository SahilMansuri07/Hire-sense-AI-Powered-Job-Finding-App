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
    portfolioLink: {
      type: String,
      default: null,
      trim: true,
    },
    status: {
      type: String,
      enum: ["applied", "rejected", "Accepted"],
      default: "applied",
      index: true,
    },
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