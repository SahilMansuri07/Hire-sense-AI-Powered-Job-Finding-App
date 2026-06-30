import common from "../../../config/common.js";
import User from "../../../models/User.js";
import Resume from "../../../models/Resume.js";
import middleware from  "../../../middleware/middleware.js"
import Codes from "../../../config/status_codes.js";
import bcryptjs from "bcryptjs";
import { extractPdfTextFromPython } from "../../../python_api/pythonService.js";
import JobRole from "../../../models/JobRole.js";
import Skill from "../../../models/Skills.js";
import { deleteFromCloudinary, uploadBufferToCloudinary } from "../../../config/cloudinary.js";

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

                    const userDetails = await common.getUserDetails({id: createUser._id});
                    const token = await common.generateToken(userDetails);

                    return middleware.sendApiResponse(
                        res,
                        Codes.SUCCESS,
                        Codes.RESPONSE_SUCCESS,
                        "User_created_successfully",
                        { ...userDetails, token }
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
                    "Email_already_exists",
                    null
                );
            }

            const existingMobile = await common.checkUniquemobile(mobile_number, country_code);
            if (existingMobile) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "Mobile_number_already_exists",
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
            
            const userDetails = await common.getUserDetails({id: createUser._id});
            
            const token = await common.generateToken(userDetails);

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "User_created_successfully",
                { ...userDetails, token }
            );

        } catch (error) {
            console.error("Error in signup: ", error);
            if (error?.code === 11000) {
                const duplicateField = Object.keys(error.keyPattern || {})[0] || "";
                const duplicateMsgKey = duplicateField === "mobile_number"
                    ? "Mobile_number_already_exists"
                    : "Email_already_exists";

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
                Codes.ERROR,
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
                        Codes.ERROR,
                        Codes.RESPONSE_SUCCESS,
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
                        Codes.RESPONSE_SUCCESS,
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
                        Codes.RESPONSE_SUCCESS,
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
                        Codes.ERROR,
                        Codes.RESPONSE_SUCCESS,
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
                        Codes.RESPONSE_SUCCESS,
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

            const token = await common.generateToken(user);

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "Login_success",
                {
                    token,
                    user,
                    role: user?.role || "user"
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

   uploadResume : async (req , res ) =>{
        try {
            // const userId = req.loginUser?.id;
            const userId = "693c9001ebf9e123580e04eb";  
            console.log("uploadResume called - loginUser:", req.loginUser && { id: req.loginUser.id, role: req.loginUser.role });

            if (!userId) {
                console.log("uploadResume: missing userId on req.loginUser");
                return middleware.sendApiResponse(
                    res,
                    Codes.ERROR,
                    Codes.RESPONSE_SUCCESS,
                    "File_required",
                    null
                );
            }
          
         
            const file = req.file || req.files?.resume?.[0] || req.files?.file?.[0] || null;
            const job_description = req.body.job_description;
        
          
            
            if (!file) {
                return middleware.sendApiResponse(
                    res,
                    Codes.ERROR,
                    Codes.RESPONSE_SUCCESS,
                    "File_required",
                    null
                );
            }

            const uploadedFile = await uploadBufferToCloudinary(file.buffer, file.originalname, userId);

            const fileUrl = uploadedFile.secure_url || uploadedFile.url || null;
            const cloudinaryPublicId = uploadedFile.public_id || null;
            
            // Check if a resume with same userId + fileName exists → UPDATE instead of create
            const existingResume = await Resume.findOne({ userId, fileName: file.originalname });

            console.log("uploadResume: existingResume found:", existingResume ? { id: existingResume._id?.toString(), cloudinaryPublicId: existingResume.cloudinaryPublicId } : null);

            let resume;

            if (existingResume) {
                resume = await Resume.findOneAndUpdate(
                    { userId, fileName: file.originalname },
                    {
                        fileUrl,
                        fileName: file.originalname,
                        cloudinaryPublicId,
                        fileSize: uploadedFile.bytes || file.size,
                        uploadedAt: new Date(),
                    },
                    { returnDocument: 'after' }
                );
                console.log("uploadResume: updated existing resume for userId:", userId, "resumeId:", resume._id?.toString());
                // if (existingResume.cloudinaryPublicId && existingResume.cloudinaryPublicId !== cloudinaryPublicId) {
                //      await deleteFromCloudinary(existingResume.cloudinaryPublicId).catch(() => null);
                // }
            } else {
                resume = await Resume.create({
                    userId,
                    fileUrl,
                    fileName: file.originalname,
                    cloudinaryPublicId,
                    fileSize: uploadedFile.bytes || file.size,
                    uploadedAt: new Date(),
                });
                console.log("uploadResume: created new resume for userId:", userId, "resumeId:", resume._id?.toString());
            }
            
            let pyResponse = null;
            
            try {
               const pythonResult = await extractPdfTextFromPython(file , job_description);    
            //    console.log("pythonResult: ",pythonResult);
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
                Codes.ERROR,
                Codes.RESPONSE_SUCCESS,
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

    // skillsListing : async (req, res) => {
    //     try {
    //         const skills = await Skill.find({
    //             is_delete: false,
    //             is_active: true,
    //         });
    //         return middleware.sendApiResponse( 
    //             res,
    //             Codes.SUCCESS,
    //             Codes.RESPONSE_SUCCESS,
    //             "Skills_listed",
    //             skills
    //         );
    //     } catch (error) {
    //         console.log("Error in skillsListing: ", error);
    //         return middleware.sendApiResponse(
    //             res,
    //             Codes.ERROR,
    //             Codes.RESPONSE_SUCCESS,
    //             "Internal_Server_Error",
    //             null
    //         );
    //     }
    // },

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
                Codes.ERROR,
                Codes.RESPONSE_SUCCESS,
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
                return middleware.sendApiResponse(res, Codes.ERROR, Codes.RESPONSE_SUCCESS, "Job role not found", null);
            }
            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS, "Skills fetched successfully", jobRole.skills || []);
        } catch (error) {
            console.log("Error in jobRoleSkills: ", error);
            return middleware.sendApiResponse(res, Codes.ERROR, Codes.RESPONSE_SUCCESS, "Internal Server Error", null);
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
            console.log("setPref", setPref);
            if(setPref === null){
                return middleware.sendApiResponse(
                    res,
                    Codes.ERROR,
                    Codes.RESPONSE_SUCCESS,
                    "Invalid_job_role_or_experience",
                    null
                );
            }

            const selectSkillsResult = await authModule.selectSkills(Skills, userId);
            if(selectSkillsResult === null){
                return middleware.sendApiResponse(
                    res,
                    Codes.ERROR,
                    Codes.RESPONSE_SUCCESS,
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
                Codes.ERROR,
                Codes.RESPONSE_SUCCESS,
                "Internal_Server_Error",
                null
            );
        }
    },
}

export default authModule;