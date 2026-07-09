import Joi from "joi";

const userValidation = {
    fetchJobsSchema: Joi.object({
        page: Joi.number().min(1).default(1),
        limit: Joi.number().min(1).default(10),
        search: Joi.string().allow('', null).optional(),
        department: Joi.string().allow('', null).optional(),
        employmentType: Joi.string().allow('', null).optional(),
        jobType: Joi.string().allow('', null).optional(),
        location: Joi.string().allow('', null).optional(),
        experience: Joi.string().allow('', null).optional(),
    }),

    applyForJobSchema: Joi.object({
        portfolio_link: Joi.string().uri().allow('', null).optional(),
        fullName: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        coverLetter: Joi.string().allow('', null).optional(),
        linkedIn: Joi.string().uri().allow('', null).optional(),
        resumeData: Joi.object({
            resumeUrl: Joi.string().uri().required(),
            fileName: Joi.string().allow('', null).optional(),
            fileSize: Joi.number().allow('', null).optional(),
            fileType: Joi.string().allow('', null).optional(),
        }).required(),
        jobId: Joi.string().allow('', null).optional(),
    }),
};

export default userValidation;
