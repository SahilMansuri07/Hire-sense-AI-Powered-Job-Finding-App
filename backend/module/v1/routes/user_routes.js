import express from "express";
import userController from "../controllers/user_controller.js";
import middleware from "../../../middleware/middleware.js";
import userValidation from "../validations/user_validations.js";

const router = express.Router();


router.post('/fetch-jobs' , middleware.validateJoi(userValidation.fetchJobsSchema, true), middleware.allowedRoles('user', 'recruiter', 'admin') , userController.fetchJobs);
router.get('/fetch-single-job/:id' , middleware.allowedRoles('user', 'recruiter', 'admin') , userController.fetchJobById);
router.post('/apply-job/:id' , middleware.validateJoi(userValidation.applyForJobSchema, true), middleware.allowedRoles('user') , userController.applyForJob);
router.get('/my-applications' , middleware.allowedRoles('user') , userController.myApplications);

// ── Individual Dashboard Section APIs (reusable) ──
router.get('/resume-score'        , middleware.allowedRoles('user') , userController.resumeScore);
router.get('/applied-jobs'        , middleware.allowedRoles('user') , userController.appliedJobs);
router.get('/application-status'  , middleware.allowedRoles('user') , userController.applicationStatus);

// ── Composed Dashboard API (aggregates all 3 above) ──
router.get('/dashboard' , middleware.allowedRoles('user') , userController.dashBoard);

router.get('/skill-gap-analysis', middleware.allowedRoles('user'), userController.skillGapAnalysis);


export default router;