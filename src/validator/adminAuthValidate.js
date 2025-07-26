const Joi = require('joi');

exports.loginAdmin = {
    body: Joi.object().keys({
        email : Joi.string().required(),
        password: Joi.string().required(),
    }),
};

exports.forgotPassword = {
    body: Joi.object().keys({
        email : Joi.string().required()
    }),
};
