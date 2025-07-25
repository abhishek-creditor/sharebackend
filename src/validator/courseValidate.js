const Joi = require('joi');

const createCourseSchema = Joi.object({
  title: Joi.string().max(150).required().trim(),
  description: Joi.string().required().trim(),
  learning_objectives: Joi.array().items(Joi.string().max(500)).optional().allow(null),
  isHidden: Joi.boolean().optional().allow(null),
  course_status: Joi.string().valid('DRAFT', 'PUBLISHED', 'ARCHIVED').optional().allow(null),
  estimated_duration: Joi.string().max(100).trim(),
  instructor_id: Joi.string().optional().allow(null),
  max_students: Joi.number().integer().min(0).optional().allow(null),
  course_level: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCE').optional().allow(null),
  courseType: Joi.string().valid('SEQUENTIAL', 'OPEN').optional().allow(null),
  lockModules: Joi.string().valid('LOCKED', 'UNLOCKED').optional().allow(null),
  price: Joi.number().min(0).precision(2).optional().allow(null),
  requireFinalQuiz: Joi.boolean().optional().allow(null),
  thumbnail: Joi.string().uri().max(300).optional().allow(null),
  created_at: Joi.date().iso().optional().allow(null),
  updated_at: Joi.date().iso().optional().allow(null),
  deleted_at: Joi.date().iso().optional().allow(null),
  createdBy: Joi.string().max(150).optional().allow(null),
  updatedBy: Joi.string().max(150).optional().allow(null),
}).options({ abortEarly: false });

module.exports = {
  createCourseSchema,
};
