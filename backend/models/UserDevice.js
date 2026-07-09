import mongoose from "mongoose";

const userDeviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    
    token: {
        type: String,
        default: null,
        trim: true,
    },

    refresh_token: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },

    refresh_token_expires_at: {
      type: Date,
      default: null,
    },

    device_token: {
      type: String,
      default: null,
      trim: true,                           // FCM / APNS push token only
    },
    device_type: {
      type: String,
      enum: ["android", "web", "ios"],      // readable over single chars "A/W/I"
      default: null,
    },
    device_name: {
      type: String,
      default: null,
      trim: true,
    },
    device_model: {
      type: String,
      default: null,
      trim: true,
    },
    os_version: {
      type: String,
      default: null,
      trim: true,
    },
    uuid: {
      type: String,
      default: null,
      trim: true,
    },
    ip: {
      type: String,
      default: null,
      trim: true,
    },
    last_active_at: {
      type: Date,
      default: Date.now,                    // track session freshness
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
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
    collection: "user_devices",
  }
);

// Fast lookup when sending push notifications by role
userDeviceSchema.index({ userId: 1, is_active: 1 });

const UserDevice =
  mongoose.models.UserDevice || mongoose.model("UserDevice", userDeviceSchema);

export default UserDevice;