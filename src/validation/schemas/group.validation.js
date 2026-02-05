// Schémas Joi pour les groupes (création, mise à jour, ajout membre, promotion admin)
const Joi = require('joi');

const createGroupSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).allow('', null),
  icon: Joi.string().uri().allow('', null),
  coverPhotoUrl: Joi.string().uri().allow('', null),
  type: Joi.string().valid('public', 'private', 'secret').required(),
  allowMembersToPost: Joi.boolean().default(true),
  allowMembersToCreateEvents: Joi.boolean().default(false),
});

const updateGroupSchema = Joi.object({
  name: Joi.string().min(1).max(200),
  description: Joi.string().max(1000).allow('', null),
  icon: Joi.string().uri().allow('', null),
  coverPhotoUrl: Joi.string().uri().allow('', null),
  type: Joi.string().valid('public', 'private', 'secret'),
  allowMembersToPost: Joi.boolean(),
  allowMembersToCreateEvents: Joi.boolean(),
}).min(1);

const addGroupMemberSchema = Joi.object({
  userId: Joi.string().required(),
  role: Joi.string().valid('member', 'admin').default('member'),
});

const promoteAdminSchema = Joi.object({
  userId: Joi.string().required(),
});

module.exports = {
  createGroupSchema,
  updateGroupSchema,
  addGroupMemberSchema,
  promoteAdminSchema,
};

