import JobPost from "../../../models/JobPost.js";
import JobApplicant from "../../../models/JobApplicant.js";
import Resume from "../../../models/Resume.js";
import middleware from "../../../middleware/middleware.js";
import Codes from "../../../config/status_codes.js";
import mongoose from "mongoose";

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
            const { status, sort, search } = req.body;
            const recruiterId = req.loginUser.id;

            const currentPage = parseInt(page);
            const pageLimit = parseInt(limit);
            const skip = (currentPage - 1) * pageLimit;

            const filter = { recruiterId: new mongoose.Types.ObjectId(recruiterId), is_delete: { $ne: true } };

            if (status && status !== 'all') {
                filter.status = status;
            }
            if (search) {
                filter.jobTitle = { $regex: search, $options: 'i' };
            }

            let sortOptions = { created_at: -1 };
            if (sort === 'applications_desc') sortOptions = { applicationCount: -1 };
            else if (sort === 'applications_asc') sortOptions = { applicationCount: 1 };
            else if (sort === 'oldest') sortOptions = { created_at: 1 };

            const pipeline = [
                { $match: filter },
                {
                    $lookup: {
                        from: 'job_applicants',
                        localField: '_id',
                        foreignField: 'jobId',
                        as: 'applications'
                    }
                },
                {
                    $addFields: {
                        applicationCount: {
                            $size: {
                                $filter: {
                                    input: "$applications",
                                    as: "app",
                                    cond: { $eq: ["$$app.is_delete", false] }
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        jobTitle: 1,
                        department: 1,
                        employmentType: 1,
                        location: 1,
                        status: 1,
                        created_at: 1,
                        applicationCount: 1
                    }
                },
                { $sort: sortOptions },
                { $skip: skip },
                { $limit: pageLimit }
            ];

            const jobs = await JobPost.aggregate(pipeline);
            
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

            const { status, sort, search } = req.query;

            const myJobs = await JobPost.find({ recruiterId, is_delete: { $ne: true } }).select('_id');
            const jobIds = myJobs.map(j => j._id);

            const filter = { jobId: { $in: jobIds }, is_delete: false };

            if (status && status !== 'all') {
                filter.status = status;
            }
            if (search) {
                filter.fullName = { $regex: search, $options: 'i' };
            }

            let sortOptions = { created_at: -1 };
            if (sort === 'asc') {
                sortOptions = { created_at: 1 };
            }

            const applicants = await JobApplicant.find(filter)
                .sort(sortOptions)
                .skip(skip) 
                .limit(limit)
                .populate('jobId', 'jobTitle department employmentType location')
                .lean();

            const total = await JobApplicant.countDocuments(filter);
            const totalPages = Math.ceil(total / limit);

            const candidates = applicants.map(app => ({
                id: app._id,
                name: app.fullName || 'Unknown Candidate',
                role: app.jobId?.jobTitle || 'Unknown Role',
                department: app.jobId?.department || 'N/A',
                employmentType: app.jobId?.employmentType || 'N/A',
                location: app.jobId?.location || 'Remote',
                email: app.email || 'N/A',
                phone: app.phone || 'N/A',
                status: app.status || 'applied',
                matchScore: app.keywordsValues?.["JD Match"] || app.keywordsValues?.["Skill Match Score"] || 0,
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
                .populate('jobId', 'jobTitle recruiterId department location employmentType expiriance_level salaryRange')
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
                phone: applicant.phone || 'N/A',
                linkedIn: applicant.linkedIn || 'N/A',
                status: applicant.status || 'pending',
                location: resumeInfo?.parsedData?.personal_info?.location || 'N/A',
                yearsOfExperience: resumeInfo?.parsedData?.total_experience_years || 'N/A',
                appliedDate: applicant.created_at,
                jobDetails: {
                    jobId: applicant.jobId?._id,
                    jobTitle: applicant.jobId?.jobTitle,
                    department: applicant.jobId?.department,
                    location: applicant.jobId?.location,
                    employmentType: applicant.jobId?.employmentType,
                    experienceLevel: applicant.jobId?.expiriance_level || 'N/A',
                    salaryRange: applicant.jobId?.salaryRange
                },
                matchMetrics: applicant.keywordsValues || {},
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
    },
    
    updateApplicationStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const recruiterId = req.loginUser.id;

            const applicant = await JobApplicant.findOne({ _id: id, is_delete: false }).populate('jobId');
            if (!applicant) {
                return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "Candidate_not_found", null);
            }
            if (applicant.jobId?.recruiterId?.toString() !== recruiterId.toString()) {
                return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "Unauthorized", null);
            }

            applicant.status = status;
            await applicant.save();

            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS, "Application_status_updated", applicant);
        } catch (error) {
            console.log("Error in updateApplicationStatus: ", error);
            return middleware.sendApiResponse(res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR, "Internal_Server_Error", null);
        }
    },

    updateJobStatus: async (req, res) => {
        try {
            const { jobId, status } = req.body;
            const recruiterId = req.loginUser.id;
            console.log("status: ",status);
            console.log("jobId: ",jobId);
            console.log("recruiterId: ",recruiterId);

            const job = await JobPost.findOne({ _id: jobId, recruiterId: recruiterId, is_delete: false });
            if (!job) {
                return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "Job_not_found", null);
            }

            job.status = status;
            await job.save();

            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS, "Job_status_updated_successfully", job);
        } catch (error) {
            console.log("Error in updateJobStatus: ", error);
            return middleware.sendApiResponse(res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR, "Internal_Server_Error", null);
        }
    }
    
}



export default recruiterModule;