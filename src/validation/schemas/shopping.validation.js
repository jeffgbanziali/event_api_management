const Joi = require('joi');

const createShoppingItemSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  quantity: Joi.number().integer().min(1).required(),
  arrivalTime: Joi.date().iso().required(),
});

module.exports = {
  createShoppingItemSchema,
};
