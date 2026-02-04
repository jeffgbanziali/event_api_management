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

const updateGroupSchema = createGroupSchema.fork(
  ['name', 'type'],
  (schema) => schema.optional()
);

const addGroupMemberSchema = Joi.object({
  userId: Joi.string().required(),
  role: Joi.string().valid('member', 'admin').default('member'),
});

module.exports = {
  createGroupSchema,
  updateGroupSchema,
  addGroupMemberSchema,
};

