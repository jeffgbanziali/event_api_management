const {
  createAlbumSchema,
  uploadPhotoSchema,
  createCommentSchema,
  updateAlbumSchema,
  updatePhotoSchema,
  updateCommentSchema,
} = require('../../../validation/schemas/album.validation');
const { validate } = require('../../../validation/middlewares/validate.middleware');
const { createAlbumForEvent } = require('../../../application/use-cases/albums/create-album.usecase');
const { updateAlbum } = require('../../../application/use-cases/albums/update-album.usecase');
const { deleteAlbum } = require('../../../application/use-cases/albums/delete-album.usecase');
const { uploadPhotoToAlbum } = require('../../../application/use-cases/albums/upload-photo.usecase');
const { updatePhoto } = require('../../../application/use-cases/albums/update-photo.usecase');
const { deletePhoto } = require('../../../application/use-cases/albums/delete-photo.usecase');
const { commentPhoto } = require('../../../application/use-cases/albums/comment-photo.usecase');
const { updateComment } = require('../../../application/use-cases/albums/update-comment.usecase');
const { deleteComment } = require('../../../application/use-cases/albums/delete-comment.usecase');
const photoAlbumRepository = require('../../../infrastructure/mongoose/repositories/photo-album.repository');
const photoRepository = require('../../../infrastructure/mongoose/repositories/photo.repository');
const commentRepository = require('../../../infrastructure/mongoose/repositories/comment.repository');
const eventParticipantRepository = require('../../../infrastructure/mongoose/repositories/event-participant.repository');

const validateCreateAlbum = validate(createAlbumSchema);
const validateUploadPhoto = validate(uploadPhotoSchema);
const validateCreateComment = validate(createCommentSchema);
const validateUpdateAlbum = validate(updateAlbumSchema);
const validateUpdatePhoto = validate(updatePhotoSchema);
const validateUpdateComment = validate(updateCommentSchema);

async function createEventAlbum(req, res, next) {
  try {
    const album = await createAlbumForEvent(
      {
        eventId: req.params.eventId,
        name: req.body.name,
        description: req.body.description,
      },
      req.user.id
    );
    res.status(201).json(album);
  } catch (err) {
    next(err);
  }
}

async function listEventAlbums(req, res, next) {
  try {
    const albums = await photoAlbumRepository.listForEvent(req.params.eventId);
    res.json(albums);
  } catch (err) {
    next(err);
  }
}

async function updateEventAlbum(req, res, next) {
  try {
    const album = await updateAlbum(req.params.albumId, req.body);
    res.json(album);
  } catch (err) {
    next(err);
  }
}

async function deleteEventAlbum(req, res, next) {
  try {
    await deleteAlbum(req.params.albumId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function uploadPhoto(req, res, next) {
  try {
    // Vérifier que l'utilisateur est participant de l'événement lié à l'album
    const album = await photoAlbumRepository.findById(req.params.albumId);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    const participant = await eventParticipantRepository.findParticipant(album.event, req.user.id);
    if (!participant) {
      return res
        .status(403)
        .json({ error: 'Forbidden: only event participants can upload photos' });
    }

    const photo = await uploadPhotoToAlbum(
      {
        albumId: req.params.albumId,
        url: req.body.url,
        caption: req.body.caption,
      },
      req.user.id
    );
    res.status(201).json(photo);
  } catch (err) {
    next(err);
  }
}

async function listAlbumPhotos(req, res, next) {
  try {
    const photos = await photoRepository.listForAlbum(req.params.albumId);
    res.json(photos);
  } catch (err) {
    next(err);
  }
}

async function updateAlbumPhoto(req, res, next) {
  try {
    const photo = await updatePhoto(req.params.photoId, req.body);
    res.json(photo);
  } catch (err) {
    next(err);
  }
}

async function deleteAlbumPhoto(req, res, next) {
  try {
    await deletePhoto(req.params.photoId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function addComment(req, res, next) {
  try {
    const photo = await photoRepository.findById(req.params.photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const participant = await eventParticipantRepository.findParticipant(photo.event, req.user.id);
    if (!participant) {
      return res
        .status(403)
        .json({ error: 'Forbidden: only event participants can comment on photos' });
    }

    const comment = await commentPhoto(
      {
        photoId: req.params.photoId,
        content: req.body.content,
      },
      req.user.id
    );
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

async function listPhotoComments(req, res, next) {
  try {
    const comments = await commentRepository.listForPhoto(req.params.photoId);
    res.json(comments);
  } catch (err) {
    next(err);
  }
}

async function updatePhotoComment(req, res, next) {
  try {
    const comment = await updateComment(req.params.commentId, req.body);
    res.json(comment);
  } catch (err) {
    next(err);
  }
}

async function deletePhotoComment(req, res, next) {
  try {
    await deleteComment(req.params.commentId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCreateAlbum,
  validateUploadPhoto,
  validateCreateComment,
  validateUpdateAlbum,
  validateUpdatePhoto,
  validateUpdateComment,
  createEventAlbum,
  listEventAlbums,
  updateEventAlbum,
  deleteEventAlbum,
  uploadPhoto,
  listAlbumPhotos,
  updateAlbumPhoto,
  deleteAlbumPhoto,
  addComment,
  listPhotoComments,
  updatePhotoComment,
  deletePhotoComment,
};

