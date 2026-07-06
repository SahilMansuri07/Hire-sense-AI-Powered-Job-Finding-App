import JobPost from "../../../models/JobPost.js";
import JobApplicant from "../../../models/JobApplicant.js";
import Resume from "../../../models/Resume.js";
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
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
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
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
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
                is_delete: { $ne: true },
            });

            if (!existingJob) {
                return middleware.sendApiResponse(
                    res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "Job_not_found", null
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
            } else if (fields.jobDescription || fields.description || fields.requirements || fields.benefits) {
                updateData.jobDescription = {
                    description: fields.jobDescription?.description || fields.description || existingJob.jobDescription?.description || "",
                    requirements: fields.jobDescription?.requirements || fields.requirements || existingJob.jobDescription?.requirements || "",
                    benefits: fields.jobDescription?.benefits || fields.benefits || existingJob.jobDescription?.benefits || "",
                };
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
                res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR, "Internal_Server_Error", null
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
                    is_delete: { $ne: true },
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
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
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
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "Internal_Server_Error",
                null
            );
        }
    },
    fetchRecruiterJob : async (req, res) => {
        try {
            const page = req.body?.page || 1;
            const limit = req.body?.limit || 10;
            const recruiterId  = req.loginUser.id;
            // console.log("recruiterId", recruiterId);    

            // fetch paginated list of jobs for this recruiter
            const currentPage = parseInt(page);
            const pageLimit = parseInt(limit);
            const skip = (currentPage - 1) * pageLimit;

            const filter = {
                recruiterId
            };

            const jobs = await JobPost.find({recruiterId})
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(pageLimit)
                .lean();

            // console.log("jobs", jobs);

            const total = await JobPost.countDocuments(filter);
            const totalPages = Math.ceil(total / pageLimit);

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "Jobs_fetched_successfully",
                {
                    jobs,
                    pagination: {
                        total,
                        totalPages,
                        currentPage,
                        limit: pageLimit
                    }
                }
            );

        } catch (error) {
             console.log("Error in fetchRecruiterJob: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "Internal_Server_Error",
                null
            );
        }
    },


    fetchRecruiterJobById : async (req, res) => {
        try {
            const {jobId} = req.body;
            const job = await JobPost.findOne({
                _id: jobId,
                recruiterId: req.loginUser.id,
                is_delete: { $ne: true },
            });

            if (!job) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "Job_not_found",
                    null
                );
            }

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "Job_fetched_successfully",
                job
            );

        } catch (error) {
             console.log("Error in fetchRecruiterJobById: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "Internal_Server_Error",
                null
            );
        }
    },
    viewApplication: async (req, res) => {
        try {
            const { jobId } = req.body;
            const applications = await Application.find({
                jobId,
                recruiterId: req.loginUser.id,
                is_delete: false,
            });

             if(!applications){
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "Applications_not_found",
                    null
                );
            }
            
            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "Applications_fetched_successfully",
                applications
            );
            
        } catch (error) {
            console.log("Error in viewApplication: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "Internal_Server_Error",
                null
            );
        }
    },

    dashboardSummary: async (req, res) => {
        try {
            const recruiterId = req.loginUser.id;
            
            const myJobs = await JobPost.find({ recruiterId, is_delete: { $ne: true } });
            const totalMyJobs = myJobs.length;
            
            const openPositionsCount = myJobs.filter(j => j.status === 'published').length;
            
            const departments = new Set(myJobs.filter(j => j.status === 'published').map(j => j.department));
            const departmentCount = departments.size;

            const jobIds = myJobs.map(j => j._id);

            const totalApplications = await JobApplicant.countDocuments({ jobId: { $in: jobIds }, is_delete: false });

            const hiredApps = await JobApplicant.find({ jobId: { $in: jobIds }, status: 'Accepted' });
            let avgHireTime = 0;
            if (hiredApps.length > 0) {
                const totalDays = hiredApps.reduce((acc, app) => {
                    const diffTime = Math.abs(new Date(app.updated_at) - new Date(app.created_at));
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return acc + diffDays;
                }, 0);
                avgHireTime = Math.round(totalDays / hiredApps.length);
            } else {
                avgHireTime = 18; 
            }

            const data = {
                totalApplications,
                totalApplicationsChange: '+12%', 
                avgHireTime,
                avgHireTimeChange: '-5%', 
                openPositions: openPositionsCount,
                departmentCount,
                myJobs: totalMyJobs
            };

            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS, "Dashboard_summary_fetched_successfully", data);
        } catch (error) {
            console.log("Error in dashboardSummary: ", error);
            return middleware.sendApiResponse(res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR, "Internal_Server_Error", null);
        }
    },

    getCandidates: async (req, res) => {
        try {
            const recruiterId = req.loginUser.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const myJobs = await JobPost.find({ recruiterId, is_delete: { $ne: true } }).select('_id');
            const jobIds = myJobs.map(j => j._id);

            const filter = { jobId: { $in: jobIds }, is_delete: false };

            const applicants = await JobApplicant.find(filter)
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit)
                .populate('jobId', 'jobTitle')
                .lean();

            const total = await JobApplicant.countDocuments(filter);
            const totalPages = Math.ceil(total / limit);

            const candidates = applicants.map(app => ({
                id: app._id,
                name: app.fullName || 'Unknown Candidate',
                role: app.jobId?.jobTitle || 'Unknown Role',
                avatar: '🧑‍💻', 
                applicationDate: app.created_at,
            }));

            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS, "Candidates_fetched_successfully", {
                candidates,
                pagination: { total, totalPages, currentPage: page, limit }
            });
        } catch (error) {
            console.log("Error in getCandidates: ", error);
            return middleware.sendApiResponse(res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR, "Internal_Server_Error", null);
        }
    },

    getCandidateProfile: async (req, res) => {
        try {
            const { id } = req.params;
            const recruiterId = req.loginUser.id;

            const applicant = await JobApplicant.findOne({ _id: id, is_delete: false })
                .populate('jobId', 'jobTitle recruiterId')
                .lean();

            if (!applicant) {
                return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "Candidate_not_found", null);
            }

            if (applicant.jobId?.recruiterId?.toString() !== recruiterId.toString()) {
                return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "Unauthorized", null);
            }

            const resumeInfo = await Resume.findOne({ userId: applicant.userId }).sort({ uploadedAt: -1 }).lean();

            const profile = {
                id: applicant._id,
                name: applicant.fullName || 'Unknown Candidate',
                title: applicant.jobId?.jobTitle || 'Unknown Role',
                email: applicant.email || 'N/A',
                location: resumeInfo?.parsedData?.personal_info?.location || 'N/A',
                yearsOfExperience: resumeInfo?.parsedData?.total_experience_years || 'N/A',
                appliedDate: applicant.created_at,
                resume: resumeInfo ? {
                    fileName: resumeInfo.fileName || 'resume.pdf',
                    fileType: "PDF",
                    fileSize: resumeInfo.fileSize || 0,
                    uploadDate: resumeInfo.uploadedAt,
                    downloadLink: resumeInfo.fileUrl
                } : null,
                otherDocuments: []
            };

            if (applicant.portfolioLink) {
                 profile.otherDocuments.push({
                     fileName: "Portfolio",
                     fileType: "Link",
                     downloadLink: applicant.portfolioLink,
                 });
            }
            if (applicant.coverLetter) {
                profile.otherDocuments.push({
                    fileName: "Cover Letter",
                    fileType: "Document",
                    downloadLink: applicant.coverLetter,
                });
            }

            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS, "Candidate_profile_fetched_successfully", profile);
        } catch (error) {
            console.log("Error in getCandidateProfile: ", error);
            return middleware.sendApiResponse(res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR, "Internal_Server_Error", null);
        }
    }

    
}



export default recruiterModule;