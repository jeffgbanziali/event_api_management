const express = require('express');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const { requireEventParticipant } = require('../../../middlewares/authorization.middleware');
const albumsController = require('../controllers/albums.controller');

const router = express.Router();

// Créer un album pour un événement
router.post(
  '/events/:eventId/albums',
  authMiddleware,
  requireEventParticipant,
  albumsController.validateCreateAlbum,
  albumsController.createEventAlbum
);

// Lister les albums d'un événement
router.get(
  '/events/:eventId/albums',
  authMiddleware,
  requireEventParticipant,
  albumsController.listEventAlbums
);

// Uploader une photo dans un album (participant de l'événement requis, contrôlé dans le contrôleur)
router.post(
  '/albums/:albumId/photos',
  authMiddleware,
  albumsController.validateUploadPhoto,
  albumsController.uploadPhoto
);

// Lister les photos d'un album
router.get('/albums/:albumId/photos', authMiddleware, albumsController.listAlbumPhotos);

// Commenter une photo (participant de l'événement requis, contrôlé dans le contrôleur)
router.post(
  '/photos/:photoId/comments',
  authMiddleware,
  albumsController.validateCreateComment,
  albumsController.addComment
);

// Lister les commentaires d'une photo
router.get('/photos/:photoId/comments', authMiddleware, albumsController.listPhotoComments);

module.exports = router;

