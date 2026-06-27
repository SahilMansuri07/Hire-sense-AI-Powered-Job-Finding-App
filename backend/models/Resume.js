import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    fileName: {
      type: String,
      trim: true,
      default: null,
    },
    cloudinaryPublicId: {
      type: String,
      trim: true,
      default: null,
    },
    fileSize: {
      type: Number,
      default: null,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    parsedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    collection: "resumes",
  }
);

// Ensure a user can have multiple resumes but filename is unique per user
resumeSchema.index({ userId: 1, fileName: 1 }, { unique: true, partialFilterExpression: { fileName: { $type: "string" } } });

const Resume = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

export default Resume;