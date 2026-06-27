import Joi from "joi";

const authValidation = {

    signupSchema: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        role: Joi.string().trim().lowercase().valid("user", "admin", "recruiter").default("user"),
        login_type: Joi.string().trim().lowercase().valid("s", "g").default("s"),
        social_id: Joi.when("login_type", {
            is: "g",
            then: Joi.string().trim().required(),
            otherwise: Joi.string().allow("", null).optional(),
        }),
        password: Joi.when("login_type", {
            is: "s",
            then: Joi.string().min(6).max(100).required(),
            otherwise: Joi.string().allow("", null).optional(),
        }),
        country_code: Joi.string().allow("", null).optional(),
        mobile_number: Joi.string().allow("", null).optional(),
    }),

    checkCredentialsSchema: Joi.object({
        email: Joi.when("login_type", {
            is: "s",
            then: Joi.string().email().required(),
            otherwise: Joi.string().allow("", null).optional(),
        }),
        mobile_number: Joi.string().allow("", null).optional(),
        country_code: Joi.string().allow("", null).optional(),
        social_id: Joi.when("login_type", {
            is: "g",
            then: Joi.string().trim().required(),
            otherwise: Joi.string().allow("", null).optional(),
        }),
        login_type: Joi.string().trim().lowercase().valid("s", "g").optional(),
    }),

    loginSchema: Joi.object({
        email: Joi.when("login_type", {
            is: "s",
            then: Joi.string().email().required(),
            otherwise: Joi.string().allow("", null).optional(),
        }),
        mobile_number: Joi.string().allow("", null).optional(),
        country_code: Joi.string().allow("", null).optional(),
        password: Joi.when("login_type", {
            is: "s",
            then: Joi.string().min(6).max(100).required(),
            otherwise: Joi.string().allow("", null).optional(),
        }),
        social_id: Joi.when("login_type", {
            is: "g",
            then: Joi.string().trim().required(),
            otherwise: Joi.string().allow("", null).optional(),
        }),
        login_type: Joi.string().trim().lowercase().valid("s", "g").required(),
    }),

    uploadResumeSchema: Joi.object({
        job_description: Joi.string().max(5000).optional(),
    }),

    setUpPreferencesSchema: Joi.object({
        jobRoleId: Joi.string().required(),
        experienceLevel: Joi.string().valid("Fresher", "Junior", "Mid", "Senior").required(),
        skills_id: Joi.array().items(Joi.string()).min(1).required(),
    }),

};

export default authValidation;