
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


};


export default recruiterController;