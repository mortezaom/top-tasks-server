const Joi = require('joi');
module.exports = Joi.object({
    _id: Joi.string(),
    name: Joi.string()
        .trim()
        .required(),
    learnTime: Joi.number()
        .default(0),
    workTime: Joi.number()
        .default(0),
    learnedTime: Joi.number()
        .default(0),
    workedTime: Joi.number()
        .default(0),
    videos: Joi.number()
        .default(0),
    deleted: Joi.boolean()
        .default(false),
});