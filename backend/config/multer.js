import multer from "multer";
import path from "path";
import { existsSync, mkdirSync } from "fs";

const uploadsDir = path.resolve("uploads");
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const pdfFileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname || "").toLowerCase();
  const isPdfMime = file.mimetype === "application/pdf";
  const isPdfExt = extension === ".pdf";

  if (isPdfMime || isPdfExt) {
    return cb(null, true);
  }

  return cb(new Error("Only PDF files are allowed"), false);
};

const profileupload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

const resumeupload = multer({
  storage: multer.memoryStorage(),
  fileFilter: pdfFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export { profileupload, resumeupload, storage, pdfFileFilter };