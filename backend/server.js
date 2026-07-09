import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import middleware from "./middleware/middleware.js";
import authRoutes from "./module/v1/routes/auth_routes.js";
import recruiterRoutes from "./module/v1/routes/recruiter_routes.js";
import applicantRoutes from "./module/v1/routes/user_routes.js";

dotenv.config();
const PORT = process.env.PORT || 7000;

if (!process.env.CORS_ORIGIN) {
  throw new Error("CORS_ORIGIN must be configured with comma-separated allowed origins");
}

const corsOrigins = process.env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean);

if (!corsOrigins.length) {
  throw new Error("CORS_ORIGIN is configured but empty");
}

const app = express();
app.set("trust proxy", 1);

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { code: 0, message: "Too_many_requests_Please_try_again_later" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const mobile = String(req.body?.mobile_number || "").trim();
    return `${req.ip}:${email || mobile || "anonymous"}`;
  },
  message: { code: 0, message: "Too_many_requests_Please_try_again_later" },
});

const aiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: Number(process.env.AI_DAILY_LIMIT || 30),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => String(req.loginUser?.id || req.ip),
  message: { code: 0, message: "AI_daily_limit_exceeded" },
});

app.use(helmet());
app.use(globalLimiter);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token", "Accept-Language"],
}));

app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/signup", authLimiter);

// Middleware to extract language from headers
app.use(middleware.extractHeaderLanguage);
app.use(middleware.tokenMiddleware);

app.use("/api/v1/auth/upload-resume", aiLimiter);
app.use("/api/v1/recruiter/generate-job-description", aiLimiter);
app.use("/api/v1/applicant/apply-job", aiLimiter);


// API Routes
app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/recruiter/", recruiterRoutes);
app.use("/api/v1/applicant/", applicantRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  return middleware.sendApiResponse(
    res,
    500,
    0,
    "Internal_Server_Error",
    null,
  );
});



// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    const { default: User } = await import("./models/User.js");
    await User.syncIndexes();
    // startCronJobs();
    app.listen(PORT, () => {
      console.log(`✓ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();