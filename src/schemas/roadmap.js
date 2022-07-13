const Joi = require('joi');
const roadmapItem = require('./roadmapItem');
module.exports = Joi.object({
    _id: Joi.string(),
    name: Joi.string().required(),
    userId: Joi.string().required(),
    items: Joi.array().items(roadmapItem).required(),
});