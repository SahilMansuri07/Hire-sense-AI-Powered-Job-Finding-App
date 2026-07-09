import common from "../../../config/common.js";
import User from "../../../models/User.js";
import Resume from "../../../models/Resume.js";
import middleware from  "../../../middleware/middleware.js"
import Codes from "../../../config/status_codes.js";
import bcryptjs from "bcryptjs";
import { extractPdfTextFromPython } from "../../../python_api/pythonService.js";
import JobRole from "../../../models/JobRole.js";

const ALLOWED_RESUME_HOSTS = (process.env.RESUME_URL_ALLOWED_HOSTS || "res.cloudinary.com")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);

function isAllowedResumeUrl(resumeUrl) {
    try {
        const parsed = new URL(resumeUrl);
        if (parsed.protocol !== "https:") {
            return false;
        }

        const hostname = parsed.hostname.toLowerCase();
        return ALLOWED_RESUME_HOSTS.some((allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`));
    } catch (error) {
        return false;
    }
}

const GENERIC_SIGNUP_COLLISION_MESSAGE = "Unable_to_create_account_with_provided_details";
const REFRESH_COOKIE_NAME = "refresh_token";
const MAX_RESUME_BYTES = Number(process.env.MAX_RESUME_BYTES || 10 * 1024 * 1024);
const RESUME_VALIDATION_TIMEOUT_MS = Number(process.env.RESUME_VALIDATION_TIMEOUT_MS || 10000);

function getRefreshCookieOptions() {
    const sameSite = process.env.REFRESH_COOKIE_SAMESITE || "strict";
    const secure = (process.env.REFRESH_COOKIE_SECURE || "true").toLowerCase() === "true";
    const maxAgeDays = Number(process.env.REFRESH_COOKIE_MAX_AGE_DAYS || 30);

    return {
        httpOnly: true,
        secure,
        sameSite,
        path: "/",
        maxAge: maxAgeDays * 24 * 60 * 60 * 1000,
    };
}

function setRefreshCookie(res, refreshToken) {
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());
}

function clearRefreshCookie(res) {
    res.clearCookie(REFRESH_COOKIE_NAME, {
        ...getRefreshCookieOptions(),
        maxAge: 0,
    });
}

function getRequestMeta(req) {
    return {
        device_token: req.body?.device_token,
        device_type: req.body?.device_type,
        device_name: req.headers["user-agent"] || req.body?.device_name || null,
        device_model: req.body?.device_model,
        os_version: req.body?.os_version,
        uuid: req.body?.uuid || null,
        ip: req.ip,
    };
}

function getAccessTokenFromRequest(req) {
    const authHeader = req.headers["authorization"] || req.headers["token"];
    if (!authHeader) return null;
    return authHeader.replace("Bearer ", "").trim();
}

async function validatePdfUrlContent(resumeUrl, declaredFileSize) {
    if (declaredFileSize && Number(declaredFileSize) > MAX_RESUME_BYTES) {
        throw new Error("Resume file exceeds allowed size");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), RESUME_VALIDATION_TIMEOUT_MS);

    try {
        const headResponse = await fetch(resumeUrl, {
            method: "HEAD",
            redirect: "error",
            signal: controller.signal,
        });

        if (!headResponse.ok) {
            throw new Error("Unable to validate resume metadata");
        }

        const contentLength = Number(headResponse.headers.get("content-length") || 0);
        if (contentLength > MAX_RESUME_BYTES) {
            throw new Error("Resume file exceeds allowed size");
        }

        const contentType = String(headResponse.headers.get("content-type") || "").toLowerCase();
        if (contentType && !contentType.includes("pdf")) {
            throw new Error("Resume content type must be PDF");
        }

        const rangeResponse = await fetch(resumeUrl, {
            method: "GET",
            headers: { Range: "bytes=0-4" },
            redirect: "error",
            signal: controller.signal,
        });

        if (!rangeResponse.ok) {
            throw new Error("Unable to validate resume file signature");
        }

        const buffer = Buffer.from(await rangeResponse.arrayBuffer());
        if (buffer.length < 5 || buffer.toString("ascii", 0, 5) !== "%PDF-") {
            throw new Error("Resume file signature is not a valid PDF");
        }
    } finally {
        clearTimeout(timeout);
    }
}

const authModule = {
    checkCredentials : async (req, res) => {
        
        const {name, email, mobile_number , country_code , social_id, login_type, role} = req.body;

        const trimedEmail = email ? email.trim().toLowerCase() : null;
        console.log("Checking credentials with: ", { email: trimedEmail, mobile_number, country_code, social_id, login_type }); // Debugging log
         const existsUserEmail = trimedEmail ? await common.checkUniqueEmail(trimedEmail) : null;
         console.log("Email check result: ", existsUserEmail?.email); // Debugging log
         console.log("Email ch/eck result: ", existsUserEmail); // Debugging log
            if (existsUserEmail && existsUserEmail.email?.toLowerCase() === trimedEmail) {
                return middleware.sendApiResponse(
                    res ,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "Email_already_exists",
                    null  
                );
            }


            const existsUserMobile = await common.checkUniquemobile(mobile_number, country_code)
            if(existsUserMobile  && existsUserMobile.mobile_number === mobile_number){
                return middleware.sendApiResponse(
                    res ,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "Mobile_number_already_exists",
                    null  
                );
            }

            if (social_id) {
                console.log("Social_ID: ", social_id);
                const existsUserSocial = await common.checkUniquesocial(social_id, login_type)
                console.log("Social check result: ", existsUserSocial?.social_id); // Debugging log
                console.log("Social check result: ", existsUserSocial); // Debugging log
                if(existsUserSocial  && existsUserSocial.social_id === social_id){
                    return middleware.sendApiResponse(
                        res ,
                        Codes.SUCCESS,
                        Codes.RESPONSE_ERROR,
                        "Social_ID_already_exists",
                        null  
                    );
                } else {
                    const normalizedRole = ["user", "admin", "recruiter"].includes(role) ? role : "user";
                    const steps = 1;

                    const userPayload = {
                        name: name || (trimedEmail ? trimedEmail.split("@")[0] : "User"),
                        email: trimedEmail,
                        login_type,
                        social_id: social_id,
                        role: normalizedRole,
                        steps
                    };
                    if (mobile_number) userPayload.mobile_number = mobile_number;
                    if (country_code) userPayload.country_code = country_code;

                    const createUser = await User.create(userPayload);

                    const session = await common.createUserSession(createUser, getRequestMeta(req));
                    const safeUser = common.sanitizeUser(createUser);
                    setRefreshCookie(res, session.refreshToken);

                    return middleware.sendApiResponse(
                        res,
                        Codes.SUCCESS,
                        Codes.RESPONSE_SUCCESS,
                        "User_created_successfully",
                        { ...safeUser, token: session.accessToken }
                    );
                }
            }

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "Success",
                null
            );
    },

    signup : async (req, res) => {
        try {
            const {name, email, password, mobile_number , country_code , login_type , social_id, role} = req.body;
            const normalizedEmail = email ? email.trim().toLowerCase() : null;
            const normalizedRole = ["user", "admin", "recruiter"].includes(role) ? role : "user";

            const existingEmail = normalizedEmail ? await common.checkUniqueEmail(normalizedEmail) : null;
            if (existingEmail) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    GENERIC_SIGNUP_COLLISION_MESSAGE,
                    null
                );
            }

            const existingMobile = await common.checkUniquemobile(mobile_number, country_code);
            if (existingMobile) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    GENERIC_SIGNUP_COLLISION_MESSAGE,
                    null
                );
            }

            if (social_id && login_type) {
                const existingSocial = await common.checkUniquesocial(social_id, login_type);
                if (existingSocial) {
                    return middleware.sendApiResponse(
                        res,
                        Codes.SUCCESS,
                        Codes.RESPONSE_ERROR,
                        "Social_ID_already_exists",
                        null
                    );
                }
            }
          
            let hashedPassword = null;
            if(login_type === "s" ){
                hashedPassword = await bcryptjs.hash(password, 10);
                // console.log("Hashed Password: ", hashedPassword); // Debugging log
            }
            let steps = 1;
            
            const userPayload = {
                name,
                email: normalizedEmail,
                password: hashedPassword || null,
                login_type,
                social_id: social_id || null,
                role: normalizedRole,
                steps
            };
            if (mobile_number) userPayload.mobile_number = mobile_number;
            if (country_code) userPayload.country_code = country_code;

            const createUser = await User.create(userPayload); 

            const session = await common.createUserSession(createUser, getRequestMeta(req));
            const safeUser = common.sanitizeUser(createUser);
            setRefreshCookie(res, session.refreshToken);

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "User_created_successfully",
                { ...safeUser, token: session.accessToken }
            );

        } catch (error) {
            console.error("Error in signup: ", error);
            if (error?.code === 11000) {
                const duplicateField = Object.keys(error.keyPattern || {})[0] || "";
                const duplicateMsgKey = duplicateField === "mobile_number"
                    ? GENERIC_SIGNUP_COLLISION_MESSAGE
                    : GENERIC_SIGNUP_COLLISION_MESSAGE;

                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    duplicateMsgKey,
                    null
                );
            }
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "Internal_Server_Error",
                null
            );
        }
    },

    login : async (req, res) => {
        try {
            const { email, password, social_id, login_type  } = req.body;

            let user;

            // 1. LOCAL LOGIN (email + password)
            if (login_type === 's') {

                if (!email || !password) {
                    return middleware.sendApiResponse(
                        res,
                        Codes.SUCCESS,
                        Codes.RESPONSE_ERROR,
                        "Email_and_password_required",
                        null
                    );
                }

                user = await User.findOne({
                    email: email,
                    is_delete: false,
                });

                if (!user) {
                    return middleware.sendApiResponse(
                        res,
                        Codes.SUCCESS,
                        Codes.RESPONSE_ERROR,
                        "Invalid_email_or_password",
                        null
                    );
                }

                // 🔥 Compare password
                const isMatch = await bcryptjs.compare(password, user.password);

                if (!isMatch) {
                    return middleware.sendApiResponse(
                        res,
                        Codes.SUCCESS,
                        Codes.RESPONSE_ERROR,
                        "Invalid_email_or_password",
                        null
                    );
                }

            }

            //  2. SOCIAL LOGIN (google, etc.)
            else {

                if (!social_id || !login_type) {
                    return middleware.sendApiResponse(
                        res,
                        Codes.SUCCESS,
                        Codes.RESPONSE_ERROR,
                        "Social_id_and_login_type_required",
                        null
                    );
                }

                user = await User.findOne({
                    social_id: social_id,
                    login_type: login_type,
                    is_delete: false,
                });

                if (!user) {
                    return middleware.sendApiResponse(
                        res,
                        Codes.SUCCESS,
                        Codes.RESPONSE_ERROR,
                        "User_not_found_social_login",
                        null
                    );
                }
            }

            // // 🟡 Generate JWT (common for both)
            // const token = jwt.sign(
            //     { userId: user._id },
            //     process.env.JWT_SECRET,
            //     { expiresIn: '7d' }
            // );

            const session = await common.createUserSession(user, getRequestMeta(req));
            const safeUser = common.sanitizeUser(user);
            setRefreshCookie(res, session.refreshToken);

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "Login_success",
                {
                    token: session.accessToken,
                    user: safeUser,
                    role: safeUser?.role || "user"
                }
            );

        } catch (error) {
            console.error("Error in login: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.ERROR,
                Codes.RESPONSE_SUCCESS,
                "Internal_Server_Error",
                null
            );
        }
    },

    refreshToken: async (req, res) => {
        try {
            const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
            if (!refreshToken) {
                return middleware.sendApiResponse(
                    res,
                    Codes.UNAUTHORIZED,
                    Codes.INVALID_TOKEN,
                    "Invalid_or_missing_token",
                    null
                );
            }

            const session = await common.refreshUserSession(refreshToken, getRequestMeta(req));
            setRefreshCookie(res, session.refreshToken);

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "Token_refreshed_successfully",
                {
                    token: session.accessToken,
                    user: session.user,
                    role: session.user?.role || "user",
                }
            );
        } catch (error) {
            clearRefreshCookie(res);
            return middleware.sendApiResponse(
                res,
                Codes.UNAUTHORIZED,
                Codes.INVALID_TOKEN,
                "Invalid_or_missing_token",
                null
            );
        }
    },

    logout: async (req, res) => {
        try {
            const accessToken = getAccessTokenFromRequest(req);
            const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

            await common.revokeSessionByAccessToken(accessToken);
            await common.revokeSessionByRefreshToken(refreshToken);

            clearRefreshCookie(res);
            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "Logout_success",
                null
            );
        } catch (error) {
            console.log("Error in logout: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "Internal_Server_Error",
                null
            );
        }
    },

   uploadResume : async (req , res ) =>{
        try {
            const userId = req.loginUser?.id;
            console.log("uploadResume called - loginUser:", req.loginUser && { id: req.loginUser.id, role: req.loginUser.role });

            if (!userId) {
                console.log("uploadResume: missing userId on req.loginUser");
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "User_id_required",
                    null
                );
            }
          
            // console.log("uploadResume - req.body:", req.body);
            const { resume_url, fileName, fileSize, fileType, job_description, cloudinaryPublicId } = req.body || {};
            console.log(resume_url)
            if (!resume_url) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "Valid_resume_url_required",
                    null
                );
            }

            if (!isAllowedResumeUrl(resume_url)) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "Valid_resume_url_required",
                    null
                );
            }

            if (fileType && !fileType.toLowerCase().includes('pdf')) {
                return middleware.sendApiResponse(
                    res,
                    Codes.ERROR,
                    Codes.RESPONSE_SUCCESS,
                    "Only_PDF_allowed",
                    null
                );
            }

            try {
                await validatePdfUrlContent(resume_url, fileSize);
            } catch (validationError) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "Only_PDF_allowed",
                    null
                );
            }

            const fileUrl = resume_url;
            const safeFileName = fileName || 'resume.pdf';
            
            // Check if a resume for the user already exists → UPDATE instead of create
            const existingResume = await Resume.findOne({ userId });

            console.log("uploadResume: existingResume found:", existingResume ? { id: existingResume._id?.toString() } : null);

            let resume;

            if (existingResume) {
                resume = await Resume.findOneAndUpdate(
                    { userId },
                    {
                        fileUrl,
                        fileName: safeFileName,
                        cloudinaryPublicId: cloudinaryPublicId || null,
                        fileSize: fileSize || 0,
                        uploadedAt: new Date(),
                    },
                    { returnDocument: 'after' }
                );
                console.log("uploadResume: updated existing resume for userId:", userId, "resumeId:", resume._id?.toString());
            } else {
                resume = await Resume.create({
                    userId,
                    fileUrl,
                    fileName: safeFileName,
                    cloudinaryPublicId: cloudinaryPublicId || null,
                    fileSize: fileSize || 0,
                    uploadedAt: new Date(),
                });
                console.log("uploadResume: created new resume for userId:", userId, "resumeId:", resume._id?.toString());
            }
            
            let pyResponse = null
            try {
               const pythonResult = await extractPdfTextFromPython(fileUrl, job_description);    
               
                if(pythonResult){
                    pyResponse = pythonResult;

                    // Persist analysis result into resume's parsedData field
                    await Resume.findByIdAndUpdate(
                        resume._id,
                        { parsedData: pyResponse },
                        { new: true }
                    );
                }

            } catch (pythonError) {
                console.log("Python analysis failed:", pythonError.message);
                // Continue without Python analysis result
            }

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "Resume_uploaded_successfully",   
                pyResponse
            );

        } catch (error) {
            console.log("Error in uploadResume: ", error);
            return middleware.sendApiResponse(
                res, 
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "Internal_Server_Error",
                null
            );
        }
    },

    setPreferences: async (jobRoleId, experienceLevel, userId) => {
        try {
            if (!jobRoleId || !experienceLevel || !userId) {
                return null;
            }

            // Validate experience level
            const validLevels = ["Fresher", "Junior", "Mid", "Senior"];
            if (!validLevels.includes(experienceLevel)) {
                return null;
            }

            // Validate jobRoleId exists
            const jobRole = await JobRole.findById(jobRoleId).lean();
            if (!jobRole) {
                return null;
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: { jobRole: { jobRoleId, experienceLevel } } },
                { new: true }
            ).populate("jobRole.jobRoleId", "name").lean();

            const responseData = {
                userId,
                jobRole: updatedUser?.jobRole?.jobRoleId?.name || null,
                experience: updatedUser?.jobRole?.experienceLevel || null,
            };

            return responseData || null;
        } catch (error) {
            console.log("Error in setPreferences: ", error);
            return null;
        }
    },

    jobRolesListing : async (req, res) => {
        try {
            const { search } = req.query;
            let query = {};
            
            if (search) {
                query.name = { $regex: search, $options: 'i' };
            }

            const roles = await JobRole.find(query);
            return middleware.sendApiResponse( 
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "Job_Roles_listed",
                roles
            );
        } catch (error) {
            console.log("Error in jobRolesListing: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "Internal_Server_Error",
                null
            );
        }
    },

    jobRoleSkills: async (req, res) => {
        try {
            const { id } = req.params;
            const jobRole = await JobRole.findById(id).lean();
            if (!jobRole) {
                return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "Job_role_not_found", null);
            }
            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS, "Skills_fetched_successfully", jobRole.skills || []);
        } catch (error) {
            console.log("Error in jobRoleSkills: ", error);
            return middleware.sendApiResponse(res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR, "Internal_Server_Error", null);
        }
    },

    selectSkills: async (Skills , userId) => {
        try {
            if (!Array.isArray(Skills)) {
                return null;
            }

            // Use $addToSet to push all skills into embedded User.skills array (no duplicates)
            await User.findByIdAndUpdate(
                userId,
                { $addToSet: { skills: { $each: Skills } } },
                { new: true }
            );
            return { selectedSkills: Skills };

        } catch (error) {
            console.log("Error in selectSkills: ", error);
            return null;
        }
    },

    getUserProfile: async (userId) => {
        try {
            
            // Read from embedded User.skills and User.jobRole
            const user = await User.findById(userId)
                .populate("jobRole.jobRoleId", "name")
                .lean();

            if (!user) return null;

            const skillNames = Array.isArray(user.skills) ? user.skills : [];
            const lastJobRole = user.jobRole;

            const responseData = {
                userId,
                jobRole: lastJobRole?.jobRoleId?.name || "Not specified",
                experience: lastJobRole?.experienceLevel || "Not specified",
                skills: skillNames.length > 0 ? skillNames : [],
            };

            return responseData || [];
    
        } catch (error) {
            console.log("Error in getUserProfile: ", error);
            return null;
        }
    },

    setUpPreferences: async (req, res) => {
        try{
            const userId = req.loginUser.id;
            const { jobRoleId, experienceLevel, Skills } = req.body;
          
            const setPref = await authModule.setPreferences(jobRoleId, experienceLevel, userId);
            if(setPref === null){
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "Invalid_job_role_or_experience",
                    null
                );
            }

            const selectSkillsResult = await authModule.selectSkills(Skills, userId);
            if(selectSkillsResult === null){
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "One_or_more_invalid_skills",
                    null
                );
            }

            const getUserProfileResult = await authModule.getUserProfile(userId);

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "Preferences_set_up_successfully",
                getUserProfileResult
            );

        }catch(error){
            console.log("Error in setUpPreferences: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "Internal_Server_Error",
                null
            );
        }
    },

    editProfile: async (req, res) => {
        try {
            const userId = req.loginUser.id;
            const { name, email, mobile_number, country_code } = req.body;

            const updateData = {};
            if (name) updateData.name = name;
            if (email) updateData.email = email;
            if (mobile_number) updateData.mobile_number = mobile_number;
            if (country_code !== undefined) updateData.country_code = country_code;

            if (email) {
                const existingEmail = await User.findOne({ email, _id: { $ne: userId }, is_delete: false });
                if (existingEmail) {
                    return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "Email_already_in_use", null);
                }
            }
            if (mobile_number) {
                const existingMobile = await User.findOne({ mobile_number, _id: { $ne: userId }, is_delete: false });
                if (existingMobile) {
                    return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "Mobile_number_already_in_use", null);
                }
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: updateData },
                { new: true }
            );

            if (!updatedUser) {
                return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "User_not_found", null);
            }

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "Profile_updated_successfully",
                common.sanitizeUser(updatedUser)
            );
        } catch (error) {
            console.log("Error in editProfile module: ", error);
            return middleware.sendApiResponse(res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR, "Internal_Server_Error", null);
        }
    },
}

export default authModule;