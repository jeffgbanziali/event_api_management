const express = require('express');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const {
  requireEventParticipant,
  requireAlbumEventParticipant,
  requirePhotoEventParticipant,
  requireCommentAuthor,
} = require('../../../middlewares/authorization.middleware');
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

// Modifier / supprimer un album (participant de l'événement)
router.patch(
  '/albums/:albumId',
  authMiddleware,
  requireAlbumEventParticipant,
  albumsController.validateUpdateAlbum,
  albumsController.updateEventAlbum
);
router.delete(
  '/albums/:albumId',
  authMiddleware,
  requireAlbumEventParticipant,
  albumsController.deleteEventAlbum
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

// Modifier / supprimer une photo (participant de l'événement)
router.patch(
  '/photos/:photoId',
  authMiddleware,
  requirePhotoEventParticipant,
  albumsController.validateUpdatePhoto,
  albumsController.updateAlbumPhoto
);
router.delete(
  '/photos/:photoId',
  authMiddleware,
  requirePhotoEventParticipant,
  albumsController.deleteAlbumPhoto
);

// Commenter une photo (participant de l'événement requis, contrôlé dans le contrôleur)
router.post(
  '/photos/:photoId/comments',
  authMiddleware,
  albumsController.validateCreateComment,
  albumsController.addComment
);

// Lister les commentaires d'une photo
router.get('/photos/:photoId/comments', authMiddleware, albumsController.listPhotoComments);

// Modifier / supprimer un commentaire (auteur uniquement)
router.patch(
  '/photos/:photoId/comments/:commentId',
  authMiddleware,
  requireCommentAuthor,
  albumsController.validateUpdateComment,
  albumsController.updatePhotoComment
);
router.delete(
  '/photos/:photoId/comments/:commentId',
  authMiddleware,
  requireCommentAuthor,
  albumsController.deletePhotoComment
);

module.exports = router;

