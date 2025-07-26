const Joi = require('joi');

const quizSchema = Joi.object({
  module_id: Joi.string().required(),
  title: Joi.string().min(3).max(255).required(),
  type: Joi.string().valid('FINAL','GENERAL').required(),
  maxAttempts: Joi.number().integer().min(3).optional(),
  time_estimate: Joi.number().integer().min(1).optional(),
  max_score: Joi.number().min(100).optional(),
  min_score: Joi.number().min(30).optional().custom((value, helpers) => {
      const { max_score } = helpers.state.ancestors[0];
      if (max_score !== undefined && value > max_score) {
        return helpers.message('Min score cannot be greater than max score');
      }
      return value;
    }, 'Min-Max Check'),
});


const quizUpdateSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  type: Joi.string().valid('FINAL','GENERAL').optional(),
  maxAttempts: Joi.number().integer().min(3).optional(),
  time_estimate: Joi.number().integer().min(1).optional(),
  max_score: Joi.number().min(0).optional(),
  min_score: Joi.number().min(0).optional().custom((value, helpers) => {
    const { max_score } = helpers.state.ancestors[0];
    if (max_score !== undefined && value > max_score) {
      return helpers.message('Min score cannot be greater than max score');
    }
    return value;
  }, 'Min-Max Check'),
}).min(1); 


const validQuestionTypes = ['MCQ', 'TRUE_FALSE', 'FILL_BLANKS', 'MATCHING', 'DESCRIPTIVE'];
const addQuestionSchema = Joi.object({
  text: Joi.string().trim().min(1).required(),
  correctAnswer: Joi.alternatives().try(Joi.string(), Joi.array(), Joi.number(), Joi.object()).required(),
  question_type: Joi.string().valid(...validQuestionTypes).default('MCQ'),
  question_options: Joi.array().items(Joi.object({
        text: Joi.string().trim().min(1).required(),
        isCorrect: Joi.boolean().optional(),
        matchWith: Joi.string().allow(null, '').optional(),
      })
    ).min(1).required().messages(),
});


const validTypes = ['MCQ', 'TRUE_FALSE', 'FILL_BLANKS', 'MATCHING', 'DESCRIPTIVE'];
const questionOptionSchema = Joi.object({
  text: Joi.string().trim().required(),
  isCorrect: Joi.boolean().optional(),
  matchWith: Joi.string().allow(null, '').optional(),
});


const bulkUploadQuestionSchema = Joi.object({
  texts: Joi.array().items(Joi.string().trim().required()).min(1).required(),
  correctAnswers: Joi.array().items(Joi.string().allow('').optional()).required(),
  question_types: Joi.array().items(Joi.string().valid(...validTypes)).required(),
  question_options: Joi.array().items(
    Joi.array().items(questionOptionSchema).min(1).required()).required()}).custom((value, helpers) => {
  const { texts, correctAnswers, question_types, question_options } = value;
  const len = texts.length;
  if (
    correctAnswers.length !== len ||
    question_types.length !== len ||
    question_options.length !== len
  ) {
    return helpers.error('any.invalid', {
      message: 'All arrays (texts, correctAnswers, question_types, question_options) must be of equal length.'
    });
  }
  return value;
}, 'Array length validation');


const updateQuestionSchema = Joi.object({
  text: Joi.string().trim().required(),
  correct_answer: Joi.string().allow('').optional(),
  question_type: Joi.string().valid(...validTypes).required(),
  question_options: Joi.array().items(questionOptionSchema).min(1).required(),
});

const questionIdParamSchema = Joi.object({
  questionId: Joi.string().required() 
});


const addOptionsSchema = Joi.object({
  options: Joi.array().items(
    Joi.object({
      text: Joi.string().required(),
      isCorrect: Joi.boolean().required(),
      matchWith: Joi.string().allow(null, '').optional()
    })
  ).min(1).required()
});


const updateOptionSchema = Joi.object({
  text: Joi.string().optional(),
  matchWith: Joi.string().optional(),
  isCorrect: Joi.boolean().optional(),
});


module.exports = {
  quizSchema,
  quizUpdateSchema,
  addQuestionSchema,
  bulkUploadQuestionSchema,
  updateQuestionSchema,
  questionIdParamSchema,
  addOptionsSchema,
  updateOptionSchema,
};
