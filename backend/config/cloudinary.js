import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

console.log(`Cloudinary configured: ${isConfigured}`);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const uploadBufferToCloudinary = (buffer, filename = null, userId = null, options = {}) => {
  if (!buffer) {
    return Promise.reject(new Error("File buffer is required for Cloudinary upload"));
  }

  if (!isConfigured) {
    return Promise.reject(new Error("Cloudinary is not configured"));
  }

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: "raw",
      allowed_formats: ["pdf"],
      format: "pdf",
      overwrite: true,
      use_filename: false,
      unique_filename: false,
      ...options,
    };

    if (filename && userId) {
      const baseName = filename.replace(/\.[^.]+$/, "");
      // Build a per-user public_id path so files don't collide across users
      // e.g. resumes/{userId}/{baseName}.pdf
      uploadOptions.public_id = `resumes/${userId}/${baseName}.pdf`;
    } else if (filename) {
      const baseName = filename.replace(/\.[^.]+$/, "");
      uploadOptions.public_id = `resumes/${baseName}.pdf`;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId || !isConfigured) {
    return null;
  }

  return cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
  });
};

export { cloudinary, deleteFromCloudinary, uploadBufferToCloudinary };