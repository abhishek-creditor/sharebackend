const Joi = require('joi');

const debateSchema = Joi.object({
  module_id: Joi.string().required(),
  title: Joi.string().min(3).max(255).required(),
  statement: Joi.string().min(10).required(),
  status: Joi.string().valid('DRAFT', 'PUBLISHED').optional(),
  total_marks: Joi.number().integer().required(),
  start_date: Joi.date().iso().optional(),
  end_date: Joi.date().iso().optional(),
  instruction: Joi.array().items(Joi.string()).optional(),

});

const addParticipantSchema = Joi.object({
  debate_id: Joi.string().required(),
  user_id: Joi.string().required(),
  group: Joi.string().valid('FOR', 'AGAINST').required(),
});

const responseSchema = Joi.object({
  debate_id: Joi.string().required(),
  user_id: Joi.string().required(),
  text: Joi.string()
    .required()
    .custom((value, helpers) => {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount < 10) {
        return helpers.message("Response must be at least 50 words");
      }
      if (wordCount > 500) {
        return helpers.message("Response must not exceed 200 words");
      }
      return value;
    }, 'Word Count Validation')
});

const giveMarksSchema = Joi.object({
  response_id: Joi.string().required(),
  marks: Joi.number().min(0).required(),
  feedback: Joi.string().allow('').optional()
});

const engagementSchema = Joi.object({
  response_id: Joi.string().required(),
  user_id: Joi.string().required(),
  action: Joi.string().valid('LIKE', 'DISLIKE').required()
});

const submitDebateSchema = Joi.object({
  debate_id: Joi.string().required(),
  user_id: Joi.string().required()
});


module.exports = {
  debateSchema,
  addParticipantSchema,
  responseSchema,
  giveMarksSchema,
  engagementSchema,
  submitDebateSchema,
  
};
