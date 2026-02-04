const Joi = require('joi');

const createPollSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
});

const createQuestionSchema = Joi.object({
  text: Joi.string().min(1).max(500).required(),
  order: Joi.number().integer().min(0).default(0),
});

const createOptionSchema = Joi.object({
  text: Joi.string().min(1).max(200).required(),
  order: Joi.number().integer().min(0).default(0),
});

const voteSchema = Joi.object({
  optionId: Joi.string().required(),
});

module.exports = {
  createPollSchema,
  createQuestionSchema,
  createOptionSchema,
  voteSchema,
};

