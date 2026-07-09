
import userModule from "../module/user_module.js";
    
const userController = {
    fetchJobs: async (req, res) => {     
       return userModule.fetchJobs(req, res);
    },

    fetchJobById: async (req, res) => {
        return userModule.fetchJobById(req, res);
    },

    applyForJob: async (req, res) => {
        return userModule.applyForJob(req, res);
    },

    myApplications: async (req, res) => {
        return userModule.myApplications(req, res);
    },

    // ── Individual Dashboard Section APIs ──
    resumeScore: async (req, res) => {
        return userModule.resumeScore(req, res);
    },

    appliedJobs: async (req, res) => {
        return userModule.appliedJobs(req, res);
    },

    applicationStatus: async (req, res) => {
        return userModule.applicationStatus(req, res);
    },

    // ── Composed Dashboard API (calls all 3 internally) ──
    dashBoard: async (req, res) => {
        return userModule.dashBoard(req, res);
    },

    skillGapAnalysis: async (req, res) => {
        return userModule.skillGapAnalysis(req, res);
    },
};

export default userController;