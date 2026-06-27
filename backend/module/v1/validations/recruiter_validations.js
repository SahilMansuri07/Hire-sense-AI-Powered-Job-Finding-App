import Joi from "joi";

const salaryRangeSchema = Joi.alternatives().try(
  Joi.object({
    min: Joi.number().min(0).default(0),
    max: Joi.number().min(0).default(0),
  }),
  Joi.string().allow("", null)
);

const jobDescriptionSchema = Joi.object({
  description: Joi.string().allow("", null).optional(),
  requirements: Joi.string().allow("", null).optional(),
  benefits: Joi.string().allow("", null).optional(),
});

const jobIdSchema = Joi.string().trim().required();

const baseJobFields = {
  jobTitle: Joi.string().trim().min(2).max(150).optional(),
  department: Joi.string().trim().valid("Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Other").optional(),
  location: Joi.string().trim().allow("", null).optional(),
  latitude: Joi.string().trim().allow("", null).optional(),
  longitude: Joi.string().trim().allow("", null).optional(),
  employmentType: Joi.string().trim().valid("Full-time", "Part-time", "Contract", "Internship").default("Full-time"),
  salaryRange: salaryRangeSchema.optional(),
  requiredSkills: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim().min(1)).default([]),
    Joi.string().allow("", null)
  ),
  additionalNotes: Joi.string().allow("", null).optional(),
};

const recruiterValidation = {

    generateJobDescriptionSchema: Joi.object({
        ...baseJobFields,
    }),

    postJobSchema: Joi.object({
        ...baseJobFields,
        jobDescription: jobDescriptionSchema.optional(),
        description: Joi.string().allow("", null).optional(),
        requirements: Joi.string().allow("", null).optional(),
        benefits: Joi.string().allow("", null).optional(),
        jobType: Joi.string().trim().valid("on-site", "remote", "hybrid").default("on-site"),
        generateWithAI: Joi.boolean().default(false),
        status: Joi.string().trim().valid("draft", "published", "closed").default("draft"),
    }),

      editJobSchema: Joi.object({
        jobId: jobIdSchema,
        ...baseJobFields,
        jobDescription: jobDescriptionSchema.optional(),
        description: Joi.string().allow("", null).optional(),
        requirements: Joi.string().allow("", null).optional(),
        benefits: Joi.string().allow("", null).optional(),
        jobType: Joi.string().trim().valid("on-site", "remote", "hybrid").optional(),
        generateWithAI: Joi.boolean().optional(),
        status: Joi.string().trim().valid("draft", "published", "closed").optional(),
      }),

      deleteJobSchema: Joi.object({
        jobId: jobIdSchema,
      }),

};

export default recruiterValidation;