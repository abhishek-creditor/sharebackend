const Joi = require('joi');

const instructionsSchema = Joi.object().pattern(
  Joi.string(), // keys like "instruction 1", "instruction 2"
  Joi.array().items(
    Joi.string().max(1000) // array of strings as steps
  )
);

const essaySchema = Joi.object({
  title : Joi.string().max(150),
  description : Joi.string().max(400),
  max_points : Joi.number().integer().required(),
  time_limit : Joi.number().integer().required(),
  word_limit  : Joi.number().integer().required(),
  difficulty  : Joi.string().valid('EASY', 'MEDIUM', 'HARD').required(),
  essay_topic : Joi.string().max(400),
  passing_score : Joi.number().integer().required(),
  instructions : instructionsSchema.required(),
  end_date : Joi.date().iso().optional(),
})



const updateEssaySchema = Joi.object({
  title : Joi.string().max(150),
  description : Joi.string().max(400),
  max_points : Joi.number().integer().required(),
  time_limit : Joi.number().integer().required(),
  word_limit  : Joi.number().integer().required(),
  difficulty  : Joi.string().valid('EASY', 'MEDIUM', 'HARD').required(),
  essay_topic : Joi.string().max(400),
  instructions : instructionsSchema.required(),
})


const GradeEssay_schema  = Joi.object({
     score: Joi.number().integer().required(),
     feedback: Joi.string().optional(),
})


const essay_submissionSchema = Joi.object({
  text : Joi.string().required(),
  time_spent : Joi.number().integer().required(),
  word_count : Joi.number().integer().required(),
})


module.exports = {essaySchema, updateEssaySchema, essay_submissionSchema, GradeEssay_schema};