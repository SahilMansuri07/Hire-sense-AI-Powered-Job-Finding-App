import Codes from "../../../config/status_codes.js";
import middleware from "../../../middleware/middleware.js";
import User from "../../../models/User.js";
import Resume from "../../../models/Resume.js";
import JobPost from "../../../models/JobPost.js";
import JobApplicant from "../../../models/JobApplicant.js";
import { extractPdfTextFromPython, extractKeywordsFromPython } from "../../../python_api/pythonService.js";

// Builds a MongoDB filter object from request body params.
// Only includes fields that are actually passed in.
const buildFilter = (body = {}) => {
    const filter = { is_active: true };

    if (body.location) {
        filter.location = { $regex: body.location, $options: "i" };
    }

    if (body.job_type) {
        filter.job_type = body.job_type;
    }

    if (body.experience_level) {
        filter.experienceLevel = body.experience_level;
    }

    if (body.min_salary) {
        filter.salaryMin = { $gte: Number(body.min_salary) };
    }

    if (body.is_remote !== undefined) {
        filter.is_remote = body.is_remote;
    }

    if (body.skills && Array.isArray(body.skills) && body.skills.length > 0) {
        filter.requiredSkills = { $in: body.skills };
    }

    if (body.search) {
        filter.$or = [
            { jobTitle: { $regex: body.search, $options: "i" } },
        ];
    }

    return filter;
};


const userModule = {

    fetchJobs: async (req, res) => {
        try {
            const userId = req.loginUser.id;
            if (!userId) {
                return middleware.sendApiResponse(
                    res,
                    Codes.ERROR,
                    Codes.RESPONSE_SUCCESS,
                    "User_ID_not_found",
                    null
                );
            }
       
            const filter = buildFilter(req.body); // uses all filters if passed, otherwise just { is_active: true }
            const jobs = await JobPost.find(filter).lean();

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "Jobs fetched successfully",
                jobs
            );
        } catch (error) {
            console.log("Error in fetchJobs: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.ERROR,
                Codes.RESPONSE_SUCCESS,
                "Internal_Server_Error",
                null
            );
        }
    },

    fetchJobById: async (req, res) => {
        try {
            const jobId = req.params.id;
            if (!jobId) {
                return middleware.sendApiResponse(
                    res,
                    Codes.ERROR,
                    Codes.RESPONSE_SUCCESS,
                    "Job_ID_not_found",
                    null
                );
            }

            const job = await JobPost.findOne({ _id: jobId, is_active: true }).lean();
            if (!job) {
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
                "Job fetched successfully",
                job
            );
        } catch (error) {
            console.log("Error in fetchJobById: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.ERROR,
                Codes.RESPONSE_SUCCESS,
                "Internal_Server_Error",
                null
            );
        }
    },

    applyForJob: async (req, res) => {
        try {
            const userId = req.loginUser.id; 
            const file = req.file || req.files?.resume?.[0] || req.files?.file?.[0] || null;
            const portfolioLink = req.body.portfolio_link || null;
            const jobId = req.params.id;
      
            if (!file) {
                return middleware.sendApiResponse(
                    res,
                    Codes.ERROR,
                    Codes.RESPONSE_SUCCESS,
                    "File_required",
                    null
                );
            }

            const fileUrl = `/uploads/${file?.filename || ""}`;
            const job = await JobPost.findOne({ _id: jobId, is_active: true, is_delete: false }).lean();

            if (!job) {
                return middleware.sendApiResponse(
                    res,
                    Codes.ERROR,
                    Codes.RESPONSE_SUCCESS,
                    "Job_not_found",
                    null
                );
            }

            const jobDescriptionText = [
                `Job Title: ${job.jobTitle || ""}`,
                `Department: ${job.department || ""}`,
                `Employment Type: ${job.employmentType || ""}`,
                `Location: ${job.location || ""}`,
                `Required Skills: ${(job.requiredSkills || []).join(", ")}`,
                `Description: ${job.jobDescription?.description || ""}`,
                `Requirements: ${job.jobDescription?.requirements || ""}`,
                `Benefits: ${job.jobDescription?.benefits || ""}`,
            ].join("\n");

            let keywordsValues = {};
      
            // Check if resume already exists → UPDATE instead of create
            try {
                const pythonResult = await extractKeywordsFromPython(file, jobDescriptionText);
                console.log("pythonResult: ", pythonResult);
                if (pythonResult) {
                    keywordsValues = pythonResult;
                }

            } catch (pythonError) {
                console.log("Python analysis failed:", pythonError.message);
                // Continue without Python analysis result
            }

            const jobApplication = await JobApplicant.create({
                jobId,
                userId,
                resumePath: fileUrl,
                keywordsValues,
                portfolioLink,
            });

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "Resume_uploaded_successfully",   
                    jobApplication
                );
        } catch (error) {
            console.log("Error in applyForJob: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.ERROR,
                Codes.RESPONSE_SUCCESS,
                "Internal_Server_Error",
                null
            );
        }
    },

    myApplications: async (req, res) => {
        try {
            const userId = req.loginUser.id; 
            const jobApplications = await JobApplicant.find({ userId }).lean();
            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "Job_applications_fetched_successfully",   
                jobApplications
            );
        } catch (error) {
            console.log("Error in myApplications: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.ERROR,
                Codes.RESPONSE_SUCCESS,
                "Internal_Server_Error",
                null
            );
        }
    },


    // ─────────────────────────────────────────────────────────────────────
    //  INDIVIDUAL DASHBOARD SECTION APIs
    // ─────────────────────────────────────────────────────────────────────

    /**
     * GET /resume-score
     * Fetches the latest resume's parsedData (already stored in DB) and returns it.
     */
    resumeScore: async (req, res) => {
        try {
            const userId = req.loginUser.id;

            // Get latest resume — parsedData already has all the score info
            const latestResume = await Resume.findOne({ userId })
                .sort({ uploadedAt: -1 })
                .lean();

            if (!latestResume || !latestResume.parsedData) {
                return middleware.sendApiResponse(
                    res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS,
                    "No_resume_data_found",
                    { stats: null, resumeInsights: null }
                );
            }

            const pd = latestResume.parsedData;

            const stats = {
                atsScore:        pd["JD Match"] || pd["jd_match"] || pd["ats_score"] || 0,
                skillAlignment:  pd["Skills Analysis"]?.["Skill Match Score"] || pd["skills_analysis"]?.["skill_match_score"] || 0,
                experienceMatch: pd["Experience Analysis"]?.["Experience Match Score"] || pd["experience_analysis"]?.["experience_match_score"] || 0,
            };

            const resumeInsights = {
                resumeId:      latestResume._id,
                fileName:      latestResume.fileName,
                uploadedAt:    latestResume.uploadedAt,
                matchedSkills:  pd["Skills Analysis"]?.["Matched Skills"]   || pd["skills_analysis"]?.["matched_skills"]   || [],
                missingSkills:  pd["Skills Analysis"]?.["Missing Skills"]   || pd["skills_analysis"]?.["missing_skills"]   || [],
                matchedKeywords: pd["Keyword Analysis"]?.["Matched Keywords"] || pd["keyword_analysis"]?.["matched_keywords"] || [],
                missingKeywords: pd["Keyword Analysis"]?.["Missing Keywords"] || pd["keyword_analysis"]?.["missing_keywords"] || [],
                strengths:      pd["Strengths"]                || pd["strengths"]                || [],
                weaknesses:     pd["Weaknesses"]               || pd["weaknesses"]               || [],
                suggestions:    pd["Improvement Suggestions"]  || pd["improvement_suggestions"]  || [],
            };

            return middleware.sendApiResponse(
                res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS,
                "Resume_score_fetched_successfully",
                { stats, resumeInsights }
            );
        } catch (error) {
            console.log("Error in resumeScore: ", error);
            return middleware.sendApiResponse(
                res, Codes.ERROR, Codes.RESPONSE_SUCCESS,
                "Internal_Server_Error", null
            );
        }
    },


    /**
     * GET /applied-jobs
     * Fetches all jobs the user applied to, with job details populated.
     */
    appliedJobs: async (req, res) => {
        try {
            const userId = req.loginUser.id;

            const applications = await JobApplicant.find({ userId, is_delete: false })
                .sort({ created_at: -1 })
                .populate({
                    path: "jobId",
                    select: "jobTitle department employmentType location",
                })
                .lean();

            // Map to a clean response
            const appliedJobs = applications.map((app) => ({
                applicationId:   app._id,
                jobId:           app.jobId?._id || null,
                companyName:     app.jobId?.department || "N/A",
                jobTitle:        app.jobId?.jobTitle || "Unknown Position",
                location:        app.jobId?.location || null,
                employmentType:  app.jobId?.employmentType || null,
                status:          app.status || "applied",
                appliedAt:       app.created_at || null,
                timeAgo:         _getTimeAgo(app.created_at),
            }));

            return middleware.sendApiResponse(
                res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS,
                "Applied_jobs_fetched_successfully",
                appliedJobs
            );
        } catch (error) {
            console.log("Error in appliedJobs: ", error);
            return middleware.sendApiResponse(
                res, Codes.ERROR, Codes.RESPONSE_SUCCESS,
                "Internal_Server_Error", null
            );
        }
    },


    /**
     * GET /application-status
     * Returns counts of applications by status (applied, accepted, rejected).
     */
    applicationStatus: async (req, res) => {
        try {
            const userId = req.loginUser.id;

            const applications = await JobApplicant.find({ userId, is_delete: false }).lean();

            const summary = {
                totalApplications: applications.length,
                appliedCount:  applications.filter((a) => a.status === "applied").length,
                acceptedCount: applications.filter((a) => a.status === "Accepted").length,
                rejectedCount: applications.filter((a) => a.status === "rejected").length,
                totalResumes:  await Resume.countDocuments({ userId }),
            };

            return middleware.sendApiResponse(
                res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS,
                "Application_status_fetched_successfully",
                summary
            );
        } catch (error) {
            console.log("Error in applicationStatus: ", error);
            return middleware.sendApiResponse(
                res, Codes.ERROR, Codes.RESPONSE_SUCCESS,
                "Internal_Server_Error", null
            );
        }
    },


    // ─────────────────────────────────────────────────────────────────────
    //  DASHBOARD API — combines all 3 above into one response
    // ─────────────────────────────────────────────────────────────────────

    dashBoard: async (req, res) => {
        try {
            const userId = req.loginUser.id;

            if (!userId) {
                return middleware.sendApiResponse(
                    res, Codes.ERROR, Codes.RESPONSE_SUCCESS,
                    "User_ID_not_found", null
                );
            }

            // 1. User profile
            const user = await User.findById(userId)
                .populate("skills", "name")
                .populate("jobRoles.jobRoleId", "name")
                .lean();

            if (!user) {
                return middleware.sendApiResponse(
                    res, Codes.ERROR, Codes.RESPONSE_SUCCESS,
                    "User_not_found", null
                );
            }

            const userProfile = {
                name:         user.name || "User",
                email:        user.email,
                profileImage: user.profile_image || null,
                skills:       (user.skills || []).map((s) => s?.name).filter(Boolean),
                jobRoles:     (user.jobRoles || []).map((jr) => ({
                    role:            jr.jobRoleId?.name || null,
                    experienceLevel: jr.experienceLevel || null,
                })),
            };

            // 2. Resume score — fetch latest resume parsedData from DB
            const latestResume = await Resume.findOne({ userId })
                .sort({ uploadedAt: -1 })
                .lean();

            let stats = null;
            let resumeInsights = null;

            if (latestResume && latestResume.parsedData) {
                const pd = latestResume.parsedData;

                stats = {
                    atsScore:        pd["JD Match"] || pd["jd_match"] || pd["ats_score"] || 0,
                    skillAlignment:  pd["Skills Analysis"]?.["Skill Match Score"] || pd["skills_analysis"]?.["skill_match_score"] || 0,
                    experienceMatch: pd["Experience Analysis"]?.["Experience Match Score"] || pd["experience_analysis"]?.["experience_match_score"] || 0,
                };

                resumeInsights = {
                    resumeId:   latestResume._id,
                    fileName:   latestResume.fileName,
                    uploadedAt: latestResume.uploadedAt,
                };
            }

            // 3. Applied jobs
            const applications = await JobApplicant.find({ userId, is_delete: false })
                .sort({ created_at: -1 })
                .populate({
                    path: "jobId",
                    select: "jobTitle department employmentType location",
                })
                .lean();

            const appliedJobs = applications.map((app) => ({
                applicationId:  app._id,
                jobId:          app.jobId?._id || null,
                companyName:    app.jobId?.department || "N/A",
                jobTitle:       app.jobId?.jobTitle || "Unknown Position",
                location:       app.jobId?.location || null,
                employmentType: app.jobId?.employmentType || null,
                status:         app.status || "applied",
                appliedAt:      app.created_at || null,
                timeAgo:        _getTimeAgo(app.created_at),
            }));

            // 4. Application status counts
            const summary = {
                totalApplications: applications.length,
                appliedCount:  applications.filter((a) => a.status === "applied").length,
                acceptedCount: applications.filter((a) => a.status === "Accepted").length,
                rejectedCount: applications.filter((a) => a.status === "rejected").length,
                totalResumes:  await Resume.countDocuments({ userId }),
            };

            // 5. Build response
            const dashboardData = {
                userProfile,
                stats,
                resumeInsights,
                appliedJobs,
                summary,
            };

            return middleware.sendApiResponse(
                res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS,
                "Dashboard_fetched_successfully",
                dashboardData
            );
        } catch (error) {
            console.log("Error in dashBoard: ", error);
            return middleware.sendApiResponse(
                res, Codes.ERROR, Codes.RESPONSE_SUCCESS,
                "Internal_Server_Error", null
            );
        }
    }
};

export default userModule;


// ── Helper: human-readable "time ago" ──
function _getTimeAgo(date) {
    if (!date) return null;
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
}