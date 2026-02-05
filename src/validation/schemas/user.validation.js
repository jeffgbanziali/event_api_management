// Schéma Joi pour la mise à jour du profil (firstName, lastName, avatarUrl)
const Joi = require('joi');

const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(1).max(100),
  lastName: Joi.string().min(1).max(100),
  avatarUrl: Joi.string().uri().allow('', null),
}).min(1);

module.exports = {
  updateProfileSchema,
};
