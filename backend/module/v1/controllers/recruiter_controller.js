
import recruiterModule from "../module/recuiter_module.js";

const recruiterController = {
    postJob: async (req, res) => {
        
        return recruiterModule.postJob(req, res);
    },

    editJob: async (req, res) => {
        return recruiterModule.editJob(req, res);
    },

    deleteJob: async (req, res) => {
        return recruiterModule.deleteJob(req, res);
    },

    generateJobDescription: async (req, res) => {
        return recruiterModule.generateJobDescription(req, res);
    },

    viewApplication: async (req, res) => {
        return recruiterModule.viewApplication(req, res);
    },

    fetchRecruiterJob: async (req, res) => {
        return recruiterModule.fetchRecruiterJob(req, res);
    },

    fetchRecruiterJobById: async (req, res) => {
        return recruiterModule.fetchRecruiterJobById(req, res);
    },

    dashboardSummary: async (req, res) => {
        return recruiterModule.dashboardSummary(req, res);
    },
    getCandidates: async (req, res) => {
        return recruiterModule.getCandidates(req, res);
    },
    getCandidateProfile: async (req, res) => {
        return recruiterModule.getCandidateProfile(req, res);
    },

    updateJobStatus: async (req , res) => {
        return recruiterModule.updateJobStatus(req, res);
    },

    updateApplicationStatus: async (req , res) => {
        return recruiterModule.updateApplicationStatus(req, res);
    }
};


export default recruiterController;