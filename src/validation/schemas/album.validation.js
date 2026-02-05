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

const updateAlbumSchema = Joi.object({
  name: Joi.string().min(1).max(200),
  description: Joi.string().max(1000).allow('', null),
}).min(1);

const updatePhotoSchema = Joi.object({
  url: Joi.string().uri(),
  caption: Joi.string().max(500).allow('', null),
}).min(1);

const updateCommentSchema = Joi.object({
  content: Joi.string().min(1).max(2000).required(),
});

module.exports = {
  createAlbumSchema,
  uploadPhotoSchema,
  createCommentSchema,
  updateAlbumSchema,
  updatePhotoSchema,
  updateCommentSchema,
};

