const Joi = require('joi');
const CONST_KEY = require('../utils/constantKey');

exports.signUpValidattion = {
    body: Joi.object().keys({
      full_name: Joi.string().required(),
      country_code: Joi.string().required(),
      phone: Joi.string()
        .pattern(/^[0-9]\d{9}$/)
        .required()
        .messages({
          "string.pattern.base": "Mobile number must be a valid 10-digit number.",
          "string.empty": "Mobile number is required.",
        }),
      email: Joi.string().required(),
      gender: Joi.string().required().valid(CONST_KEY.GENDER.MALE,CONST_KEY.GENDER.FEMALE,CONST_KEY.GENDER.OTHER),
      age: Joi.string().required(),
      full_address: Joi.string(),
      house_no: Joi.string(),
      street: Joi.string(),
      landmark: Joi.string(),
      pincode: Joi.string(),
      latitude: Joi.string(),
      longitude: Joi.string()
    })
}

exports.otpVerify = {
  body: Joi.object().keys({
      country_code: Joi.string().required(),
      phone: Joi.string()
        .pattern(/^[0-9]\d{9}$/)
        .required()
        .messages({
          "string.pattern.base": "Mobile number must be a valid 10-digit number.",
          "string.empty": "Mobile number is required.",
        }),
      otp: Joi.string().required(),
      fcm_token: Joi.string(),
  })
}

exports.signIn = {
  body: Joi.object().keys({
      country_code: Joi.string().required(),
      phone: Joi.string()
        .pattern(/^[0-9]\d{9}$/)
        .required()
        .messages({
          "string.pattern.base": "Mobile number must be a valid 10-digit number.",
          "string.empty": "Mobile number is required.",
        }),
  })
}

exports.phoneRequiredSchema = {
  body: Joi.object().keys({
    country_code: Joi.string().required(),
    phone: Joi.string()
    .pattern(/^[0-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be a valid 10-digit number.",
      "string.empty": "Mobile number is required.",
    }),
  }),
};

exports.updateProfileValidattion = {
  body: Joi.object().keys({
    full_name: Joi.string(),
    gender: Joi.string().valid(CONST_KEY.GENDER.MALE,CONST_KEY.GENDER.FEMALE,CONST_KEY.GENDER.OTHER),
    age: Joi.string(),
    full_address: Joi.string(),
  })
}