import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import middleware from "./middleware/middleware.js";
import authRoutes from "./module/v1/routes/auth_routes.js";
import recruiterRoutes from "./module/v1/routes/recruiter_routes.js";
import applicantRoutes from "./module/v1/routes/user_routes.js";

dotenv.config();
const PORT = process.env.PORT || 7000;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim()) : true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token", "api-key", "Accept-Language"],
}));

// Middleware to extract language from headers
app.use(middleware.extractHeaderLanguage);
//uploads folder for static files
app.use("/uploads", express.static("uploads"));
app.use(middleware.tokenMiddleware);
app.use(middleware.checkApi);
app.use(middleware.decryption);


// API Routes
app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/recruiter/", recruiterRoutes);
app.use("/api/v1/applicant/", applicantRoutes);



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