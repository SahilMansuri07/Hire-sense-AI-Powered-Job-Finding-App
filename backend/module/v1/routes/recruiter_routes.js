import express from "express";
import recruiterController from "../controllers/recruiter_controller.js";
import middleware from "../../../middleware/middleware.js";
import recruiterValidation from "../validations/recruiter_validations.js";

const router = express.Router();

router.post(`/generate-job-description`, middleware.validateJoi(recruiterValidation.generateJobDescriptionSchema, true), middleware.allowedRoles('recruiter'), recruiterController.generateJobDescription);

router.post(`/post-job`, middleware.validateJoi(recruiterValidation.postJobSchema, true), middleware.allowedRoles('recruiter'), recruiterController.postJob);

router.put(`/edit-job`, middleware.validateJoi(recruiterValidation.editJobSchema, true), middleware.allowedRoles('recruiter'), recruiterController.editJob);

router.delete(`/delete-job`, middleware.validateJoi(recruiterValidation.deleteJobSchema, true), middleware.allowedRoles('recruiter'), recruiterController.deleteJob);

export default router;