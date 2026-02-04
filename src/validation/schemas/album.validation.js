const Joi = require('joi');

const createAlbumSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).allow('', null),
});

const uploadPhotoSchema = Joi.object({
  url: Joi.string().uri().required(),
  caption: Joi.string().max(500).allow('', null),
});

const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(2000).required(),
});

module.exports = {
  createAlbumSchema,
  uploadPhotoSchema,
  createCommentSchema,
};

