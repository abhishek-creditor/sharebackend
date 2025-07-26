const Joi = require("joi");

const catalogSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().allow('').optional()
});


const addCoursesToCatalogSchema = Joi.object({
  courseIds: Joi.array().items(Joi.string().trim().required()).min(1).required()
});


const updateCatalogSchema = Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().allow('').optional(),
  thumbnail: Joi.string().uri().optional(),
  courseIds: Joi.array().items(Joi.string()).optional()
});

module.exports = { catalogSchema,addCoursesToCatalogSchema,updateCatalogSchema };
