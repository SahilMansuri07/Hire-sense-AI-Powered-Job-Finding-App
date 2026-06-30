import mongoose from "mongoose";

const jobRoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    collection: "job_roles",
  }
);

const JobRole = mongoose.models.JobRole || mongoose.model("JobRole", jobRoleSchema);

export default JobRole;