import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
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
    password: {
      type: String,
      default: null,
      required: function () {
      return this.login_type === 's'; // only required for standard login
    }
    },
    country_code: {
      type: String,
      required : false,
    },
    mobile_number: {
      type: String,
      required : true,
    },
    social_id : {
      type: String,
      default: null,
    },
    profile_image: {
      type: String,
      default: null,
    },
    latitude : {
      type: String,
      default: null,
    },
    longitude : {
      type: String,
      default: null,
    },

    location : {
      type: String,
      default: null,
    },
    steps : {
      type: Number,
      default: 0,
    },
    role : {
      type: String,
      enum: ["user", "admin", "recruiter"],
      default: "user",
    },
    login_type: {
      type: String,
      enum: ["s", "g"],
      default: "s",
      // s = Standard (email/password), g = Google (social login)
    },
    // replaces UserSkill junction table
    skills: {
      type: [String],
      default: [],
    },

    // replaces UserJobRole + ExperienceLevel junction tables
    jobRole: {
      jobRoleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobRole",
      },
      experienceLevel: {
        type: String,
        enum: ["Fresher", "Junior", "Mid", "Senior"],
      },
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
    collection: "users",
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ email: 1, is_delete: 1 });
userSchema.index({ mobile_number: 1, is_delete: 1 }, { unique: true, sparse: true });


const User = mongoose.model("User", userSchema);

export default User;
