import JobPost from "../../../models/JobPost.js";
import middleware from "../../../middleware/middleware.js";
import Codes from "../../../config/status_codes.js";

const PYTHON_API_BASE_URL = (process.env.PYTHON_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

const parseRequiredSkills = (requiredSkills) => {
    if (Array.isArray(requiredSkills)) {
        return requiredSkills.map((skill) => String(skill).trim()).filter(Boolean);
    }

    if (typeof requiredSkills === "string") {
        return requiredSkills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);
    }

    return [];
};

const parseSalaryRange = (salaryRange) => {
    if (!salaryRange) {
        return { min: 0, max: 0 };
    }

    if (typeof salaryRange === "object") {
        return {
            min: Number(salaryRange.min) || 0,
            max: Number(salaryRange.max) || 0,
        };
    }

    const numericValues = String(salaryRange).match(/\d[\d,]*/g) || [];

    if (numericValues.length === 0) {
        return { min: 0, max: 0 };
    }

    const min = Number(numericValues[0].replace(/,/g, "")) || 0;
    const max = Number((numericValues[1] || numericValues[0]).replace(/,/g, "")) || min;

    return { min, max };
};

import { getAiJobDescription } from "../../../python_api/pythonService.js";

const recruiterModule = {

    generateJobDescription: async (req, res) => {
        try {
            const {
                jobTitle,
                department,
                employmentType,
                location,
                salaryRange,
                requiredSkills,
                additionalNotes,
            } = req.body;

            const aiResult = await getAiJobDescription({
                job_title: jobTitle,
                department,
                employment_type: employmentType,
                location,
                salary_range: salaryRange,
                required_skills: parseRequiredSkills(requiredSkills),
                additional_notes: additionalNotes,
            });

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "Job_generated_successfully",
                aiResult
            );
        } catch (error) {
            console.log("Error in generateJobDescription: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.ERROR,
                Codes.RESPONSE_SUCCESS,
                "Internal_Server_Error",
                null
            );
        }
    },

    postJob: async (req, res) => {
        try {
        
            const {
                jobTitle,
                department,
                location,
                latitude,
                longitude,
                employmentType,
                salaryRange,
                requiredSkills,
                jobDescription,
                description,
                requirements,
                benefits,
                jobType,
                status,
                generateWithAI,
                additionalNotes,
            } = req.body;

            const parsedSalaryRange = parseSalaryRange(salaryRange);
            const parsedRequiredSkills = parseRequiredSkills(requiredSkills);

            let finalJobDescription = jobDescription;
            let aiGenerated = false;

            if (generateWithAI) {
                const aiResult = await getAiJobDescription({
                    job_title: jobTitle,
                    department,
                    employment_type: employmentType,
                    location,
                    salary_range: salaryRange,
                    required_skills: parsedRequiredSkills,
                    additional_notes: additionalNotes,
                });

                finalJobDescription = aiResult?.jobDescription || aiResult || {};
                aiGenerated = true;
            }

            const normalizedJobDescription = {
                description:
                    finalJobDescription?.description ||
                    description ||
                    "",
                requirements:
                    finalJobDescription?.requirements ||
                    requirements ||
                    "",
                benefits:
                    finalJobDescription?.benefits ||
                    benefits ||
                    "",
            };

            const jobPost = await JobPost.create({
                recruiterId: req.loginUser.id,
                jobTitle: jobTitle.trim(),
                department,
                location: location || null,
                latitude: latitude || null,
                longitude: longitude || null,
                employmentType: employmentType || "Full-time",
                job_type: jobType || "on-site",
                salaryRange: parsedSalaryRange,
                requiredSkills: parsedRequiredSkills,
                jobDescription: normalizedJobDescription,
                aiGenerated,
                status: status || "draft",
            });

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "Job_posted_successfully",
                jobPost
            );
        } catch (error) {
            console.log("Error in postJob: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.ERROR,
                Codes.RESPONSE_SUCCESS,
                "Internal_Server_Error",
                null
            );
        }
    },

    editJob: async (req, res) => {
        try {

            const { jobId, generateWithAI, additionalNotes, ...fields } = req.body;
            
            const existingJob = await JobPost.findOne({
                _id: jobId,
                recruiterId: req.loginUser.id,
                is_delete: false,
            });

            if (!existingJob) {
                return middleware.sendApiResponse(
                    res, Codes.ERROR, Codes.RESPONSE_SUCCESS, "Job_not_found", null
                );
            }

            // Build update object — only include fields that were actually passed
            const updateData = {};

            if (fields.jobTitle)      updateData.jobTitle      = fields.jobTitle.trim();
            if (fields.department)    updateData.department    = fields.department;
            if (fields.location)      updateData.location      = fields.location;
            if (fields.latitude)      updateData.latitude      = fields.latitude;
            if (fields.longitude)     updateData.longitude     = fields.longitude;
            if (fields.employmentType) updateData.employmentType = fields.employmentType;
            if (fields.jobType)       updateData.job_type      = fields.jobType;
            if (fields.status)        updateData.status        = fields.status;
            if (fields.salaryRange)   updateData.salaryRange   = parseSalaryRange(fields.salaryRange);
            if (fields.requiredSkills) updateData.requiredSkills = parseRequiredSkills(fields.requiredSkills);

            // Handle job description — AI or manual
            if (generateWithAI) {
                const aiResult = await getAiJobDescription({
                    job_title:        updateData.jobTitle      || existingJob.jobTitle,
                    department:       updateData.department    || existingJob.department,
                    employment_type:  updateData.employmentType || existingJob.employmentType,
                    location:         updateData.location      || existingJob.location,
                    salary_range:     updateData.salaryRange   || existingJob.salaryRange,
                    required_skills:  updateData.requiredSkills || existingJob.requiredSkills,
                    additional_notes: additionalNotes,
                });

                updateData.jobDescription = aiResult?.jobDescription || aiResult || {};
                updateData.aiGenerated = true;
            } else if (fields.jobDescription || fields.description) {
                updateData.jobDescription = buildJobDescription(
                    existingJob.jobDescription,
                    fields.jobDescription,
                    { description: fields.description, requirements: fields.requirements, benefits: fields.benefits }
                );
            }

            const updatedJob = await JobPost.findByIdAndUpdate(
                existingJob._id,
                { $set: updateData },
                { new: true }
            );

            return middleware.sendApiResponse(
                res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS, "Job_updated_successfully", updatedJob
            );
        } catch (error) {
            console.log("Error in editJob: ", error);
            return middleware.sendApiResponse(
                res, Codes.ERROR, Codes.RESPONSE_SUCCESS, "Internal_Server_Error", null
            );
        }
    },

    deleteJob: async (req, res) => {
        try {
            const { jobId } = req.body;

            const updatedJob = await JobPost.findOneAndUpdate(
                {
                    _id: jobId,
                    recruiterId: req.loginUser.id,
                    is_delete: false,
                },
                {
                    $set: {
                        is_delete: true,
                        is_active: false,
                        status: "closed",
                    },
                },
                { new: true }
            );

            if (!updatedJob) {
                return middleware.sendApiResponse(
                    res,
                    Codes.ERROR,
                    Codes.RESPONSE_SUCCESS,
                    "Job_not_found",
                    null
                );
            }

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "Job_deleted_successfully",
                updatedJob
            );
        } catch (error) {
            console.log("Error in deleteJob: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.ERROR,
                Codes.RESPONSE_SUCCESS,
                "Internal_Server_Error",
                null
            );
        }
    },

    

    
}



export default recruiterModule;