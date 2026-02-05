const Joi = require('joi');

const createEventSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(2000).allow('', null),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
  location: Joi.string().min(1).max(500).required(),
  coverPhotoUrl: Joi.string().uri().allow('', null),
  visibility: Joi.string().valid('public', 'private').default('public'),
  settings: Joi.object({
    shoppingListEnabled: Joi.boolean().default(false),
    carpoolingEnabled: Joi.boolean().default(false),
    ticketingEnabled: Joi.boolean().default(false),
  }).default({}),
});

const updateEventSchema = Joi.object({
  name: Joi.string().min(1).max(200),
  description: Joi.string().max(2000).allow('', null),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
  location: Joi.string().min(1).max(500),
  coverPhotoUrl: Joi.string().uri().allow('', null),
  visibility: Joi.string().valid('public', 'private'),
  settings: Joi.object({
    shoppingListEnabled: Joi.boolean(),
    carpoolingEnabled: Joi.boolean(),
    ticketingEnabled: Joi.boolean(),
  }),
}).min(1);

const addParticipantSchema = Joi.object({
  userId: Joi.string().required(),
  role: Joi.string().valid('participant', 'organizer').default('participant'),
});

module.exports = {
  createEventSchema,
  updateEventSchema,
  addParticipantSchema,
};

