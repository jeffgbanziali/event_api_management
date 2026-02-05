// Schémas Joi pour threads et messages
const Joi = require('joi');

const createThreadSchema = Joi.object({
  title: Joi.string().max(200).allow('', null),
});

const createMessageSchema = Joi.object({
  content: Joi.string().min(1).max(5000).required(),
  parentMessageId: Joi.string().allow(null),
});

module.exports = {
  createThreadSchema,
  createMessageSchema,
};

