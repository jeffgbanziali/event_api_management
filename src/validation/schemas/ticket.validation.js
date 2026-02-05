const Joi = require('joi');

const createTicketTypeSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  price: Joi.number().min(0).required(),
  currency: Joi.string().min(1).max(10).default('EUR'),
  quantity: Joi.number().integer().min(1).required(),
});

const updateTicketTypeSchema = Joi.object({
  name: Joi.string().min(1).max(200),
  price: Joi.number().min(0),
  currency: Joi.string().min(1).max(10),
  quantity: Joi.number().integer().min(1),
}).min(1);

const purchaseTicketSchema = Joi.object({
  ticketTypeId: Joi.string().required(),
  buyerEmail: Joi.string().email().required(),
  buyerFirstName: Joi.string().min(1).max(100).required(),
  buyerLastName: Joi.string().min(1).max(100).required(),
  buyerAddress: Joi.object({
    street: Joi.string().min(1).max(200).required(),
    city: Joi.string().min(1).max(100).required(),
    zip: Joi.string().min(1).max(20).required(),
    country: Joi.string().min(1).max(100).required(),
  }).required(),
});

module.exports = {
  createTicketTypeSchema,
  updateTicketTypeSchema,
  purchaseTicketSchema,
};

