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
    // If you imported via Compass, is_active might be undefined, but we'll assume true or missing.
    // To be safe against Compass imports, we can check { $ne: false } instead of true.
    const filter = { is_active: { $ne: false }, is_delete: { $ne: true } };

    if (body.location) {
        filter.location = { $regex: body.location, $options: "i" };
    }

    if (body.job_type) {
        filter.employmentType = body.job_type;
    }

    // JobPost doesn't have an experienceLevel field, it's usually inferred from jobTitle
    if (body.experience_level) {
        filter.jobTitle = { $regex: body.experience_level, $options: "i" };
    }

    if (body.min_salary) {
        filter["salaryRange.min"] = { $gte: Number(body.min_salary) };
    }

    if (body.is_remote !== undefined) {
        if (body.is_remote) {
            filter.job_type = "remote";
        }
    }

    if (body.skills && Array.isArray(body.skills) && body.skills.length > 0) {
        filter.requiredSkills = { $in: body.skills };
    }

    if (body.search) {
        filter.$or = [
            { jobTitle: { $regex: body.search, $options: "i" } },
            { department: { $regex: body.search, $options: "i" } }
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
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "User_ID_not_found",
                    null
                );
            }
            const page = parseInt(req.body.page) || 1;
            const limit = parseInt(req.body.limit) || 10;
            const skip = (page - 1) * limit;
            const filter = buildFilter(req.body);
            const jobs = await JobPost.find(filter).skip(skip).limit(limit).lean();
            const total = await JobPost.countDocuments(filter);
            const totalPages = Math.ceil(total / limit);

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
                        currentPage: page,
                        limit
                    }
                }
            );
        } catch (error) {
            console.log("Error in fetchJobs: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "Internal_Server_Error",
                null
            );
        }
    },

    fetchJobById: async (req, res) => {
        try {
            const jobId = req.params.id;
            // console.log("jobId: ", jobId);
            if (!jobId) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "Job_ID_not_found",
                    null
                );
            }

            const job = await JobPost.findOne({ 
                _id: jobId, 
                is_active: { $ne: false }, 
                is_delete: { $ne: true } 
            }).lean();
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
            console.log("Error in fetchJobById: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "Internal_Server_Error",
                null
            );
        }
    },

    applyForJob: async (req, res) => {
        try {
            const userId = req.loginUser.id; 
            const portfolioLink = req.body.portfolio_link || null;
            const { fullName, email, phone, coverLetter, linkedIn, resumeData } = req.body;
            const jobId = req.params.id || req.body.jobId;
            console.log("jobId: ", jobId);
            if (!resumeData || !resumeData.resumeUrl) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "File_required",
                    null
                );
            }

            const fileUrl = resumeData.resumeUrl;
            const job = await JobPost.findOne({ 
                _id: jobId, 
                is_active: { $ne: false }, 
                is_delete: { $ne: true } 
            }).lean();

            if (!job) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
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
                const pythonResult = await extractKeywordsFromPython(resumeData.resumeUrl, jobDescriptionText);
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
                fullName,
                email,
                phone,
                coverLetter,
                linkedIn,
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
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "Internal_Server_Error",
                null
            );
        }
    },

    myApplications: async (req, res) => {
        try {
            const userId = req.loginUser.id; 
            const jobApplications = await JobApplicant.find({ userId }).populate('jobId').lean();
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
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
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
                res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR,
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
                res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR,
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
                res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR,
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
                    res, Codes.SUCCESS, Codes.RESPONSE_ERROR,
                    "User_ID_not_found", null
                );
            }

            // 1. User profile (only need name)
            const user = await User.findById(userId).select("name").lean();

            if (!user) {
                return middleware.sendApiResponse(
                    res, Codes.SUCCESS, Codes.RESPONSE_ERROR,
                    "User_not_found", null
                );
            }

            // 2. Applied jobs
            const applications = await JobApplicant.find({ userId, is_delete: false })
                .sort({ created_at: -1 })
                .populate({
                    path: "jobId",
                    select: "jobTitle department employmentType location",
                })
                .lean();

            const recentAppliedJobs = applications.map((app) => ({
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

            // 3. Application status counts
            const totalAppliedJobs = applications.length;
            const pending = applications.filter((a) => ["applied", "pending"].includes((a.status || "").toLowerCase())).length;
            const accepted = applications.filter((a) => (a.status || "").toLowerCase() === "accepted").length;
            const rejected = applications.filter((a) => (a.status || "").toLowerCase() === "rejected").length;

            // 4. Build response
            const dashboardData = {
                UserName: user.name || "User",
                totalAppliedJobs,
                pending,
                accepted,
                rejected,
                recentAppliedJobs,
            };

            return middleware.sendApiResponse(
                res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS,
                "Dashboard_fetched_successfully",
                dashboardData
            );
        } catch (error) {
            console.log("Error in dashBoard: ", error);
            return middleware.sendApiResponse(
                res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR,
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