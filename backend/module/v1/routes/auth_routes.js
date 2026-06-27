import express from "express";

import authController from "../controllers/auth_controller.js";
import middleware from "../../../middleware/middleware.js";
import authValidation from "../validations/auth_validations.js";

const router = express.Router();

router.post("/validate-user", middleware.validateJoi(authValidation.checkCredentialsSchema, true), authController.checkCredentials);

router.post("/signup", middleware.validateJoi(authValidation.signupSchema), authController.signup);

router.post("/login", middleware.validateJoi(authValidation.loginSchema), authController.login);

router.post("/upload-resume" , authController.uploadResume);

router.get("/skills" , authController.skillsListing);
router.get("/job-roles" , authController.jobRolesListing);

router.post("/set-up-preferences" , authController.setUpPreferences);

router.get("/user-profile" , middleware.tokenMiddleware , authController.getUserProfile);

export default router;