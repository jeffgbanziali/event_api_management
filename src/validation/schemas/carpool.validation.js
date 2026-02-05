// Schéma Joi pour la création d'un trajet covoiturage
const Joi = require('joi');

const createRideSchema = Joi.object({
  departurePlace: Joi.string().min(1).max(300).required(),
  departureTime: Joi.date().iso().required(),
  price: Joi.number().min(0).required(),
  currency: Joi.string().max(10).default('EUR'),
  seatsAvailable: Joi.number().integer().min(1).required(),
  maxDetourMinutes: Joi.number().integer().min(0).required(),
});

module.exports = {
  createRideSchema,
};
