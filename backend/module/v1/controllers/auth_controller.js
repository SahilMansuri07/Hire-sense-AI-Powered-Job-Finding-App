import authModule from "../module/auth_module.js";
import middleware from "../../../middleware/middleware.js";
import Codes from "../../../config/status_codes.js";

const authController = {
    async checkCredentials(req, res){
        return authModule.checkCredentials(req, res);
    },
    
    async signup(req, res){
        return authModule.signup(req, res);
    },

    async login(req, res){
        return authModule.login(req, res);
    },

    async uploadResume(req, res){
            return middleware.resumeUploadMiddleware(req, res, () => {
                return authModule.uploadResume(req, res);
            })
    },
        

    async setPreferences(req, res){
        return authModule.setPreferences(req, res);
    },  

    async skillsListing(req, res){
        return authModule.skillsListing(req, res);
    },

    async jobRolesListing(req, res){
        return authModule.jobRolesListing(req, res);
    },

    async jobRoleSkills(req, res){
        return authModule.jobRoleSkills(req, res);
    },

    async selectSkills(req, res){
        return authModule.selectSkills(req, res);
    },

    async getUserProfile(req, res){
        try {
            const userId = req.loginUser?.id;
            if(!userId) {
                return middleware.sendApiResponse(res, Codes.ERROR, Codes.RESPONSE_SUCCESS, "User_ID_not_found", null);
            }
            const profile = await authModule.getUserProfile(userId);
            if (!profile) {
                return middleware.sendApiResponse(res, Codes.ERROR, Codes.RESPONSE_SUCCESS, "User_not_found", null);
            }
            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS, "Profile fetched", profile);
        } catch (error) {
            console.log("Error in getUserProfile controller: ", error);
            return middleware.sendApiResponse(res, Codes.ERROR, Codes.RESPONSE_SUCCESS, "Internal_Server_Error", null);
        }
    },

    async setUpPreferences(req, res){
        return middleware.tokenMiddleware(req, res, () => {
            return middleware.resumeUploadMiddleware(req, res, () => {
                return authModule.setUpPreferences(req, res);
            });
        });
    },
}




export default authController;