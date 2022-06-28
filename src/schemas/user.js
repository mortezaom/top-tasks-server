const Joi = require('joi')
module.exports = Joi.object({
    name: Joi.string()
        .trim()
        .required(),
    username: Joi.string()
        .trim()
        .required(),
    password: Joi.string()
        .trim()
        .required(),
});