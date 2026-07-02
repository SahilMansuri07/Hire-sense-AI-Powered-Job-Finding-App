
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
};


export default recruiterController;