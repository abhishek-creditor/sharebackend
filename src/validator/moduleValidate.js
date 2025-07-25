const Joi = require('joi');

const moduleSchema = Joi.object({
     title : Joi.string().max(150), 
     description : Joi.string(), 
     order: Joi.number().integer(),
     estimated_duration : Joi.number().integer(),
     module_status: Joi.string().valid('DRAFT','PUBLISHED', 'ARCHIVED').required(),
     thumbnail : Joi.string().max(300)
})



module.exports = {moduleSchema};