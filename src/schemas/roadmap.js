const Joi = require('joi');
const roadmapItem = require('./roadmapItem');
module.exports = Joi.object({
    items: Joi.array().items(roadmapItem).required(),
    userId: Joi.string().required(),
    name: Joi.string().required(),
});