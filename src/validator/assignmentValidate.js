const Joi = require('joi');

const instructionsSchema = Joi.object().pattern(
  Joi.string(), 
  Joi.array().items(
    Joi.string().max(1000) 
  )
);

// Single Question Schema
const questionSchema = Joi.object({
  question_text: Joi.string().max(1000).required(),
  points: Joi.number().integer().min(1).required(),
  minimum_words: Joi.number().integer().optional(),
  maximum_words: Joi.number().integer().optional()
});

// Questions Array Schema
const questionsArraySchema = Joi.array()
  .items(questionSchema)
  .min(1)
  .required();

const assignmentSchema = Joi.object({
  title : Joi.string().max(150),
  description : Joi.string().max(400),
  max_score : Joi.number().integer().required(),
  time_limit : Joi.number().integer().required(),
  difficulty  : Joi.string().valid('EASY', 'MEDIUM', 'HARD').required(),
  instructions : instructionsSchema.required(),
  end_date : Joi.date().iso().optional(),
  questions: questionsArraySchema.required() 
})



const updateAssignmentSchema = Joi.object({
  title : Joi.string().max(150),
  description : Joi.string().max(400),
  time_limit : Joi.number().integer().required(),
  max_score : Joi.number().integer().required(),
  difficulty  : Joi.string().valid('EASY', 'MEDIUM', 'HARD').required(),
  instructions : instructionsSchema.required(),
})

const updateQuestionSchema = Joi.object({
  question_text: Joi.string().required(),
  points: Joi.number().integer().required()
})

const addQuestionSchema = Joi.object({
  question_text: Joi.string().required(),
  points: Joi.number().integer().required()
})

const GradeAssignment_schema  = Joi.object({
     score: Joi.number().integer().required(),
     feedback: Joi.string().optional(),
})


const assignment_submissionSchema = Joi.object({
   url : Joi.string().max(250).required(),
  additional_notes : Joi.string().optional()
})


module.exports = {assignmentSchema, updateAssignmentSchema, updateQuestionSchema, addQuestionSchema, GradeAssignment_schema, assignment_submissionSchema};