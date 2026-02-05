const express = require('express');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const {
  requireEventOrganizer,
  requireEventParticipantForPoll,
  requirePollOrganizer,
  requireOrganizerByQuestionId,
} = require('../../../middlewares/authorization.middleware');
const pollsController = require('../controllers/polls.controller');

const router = express.Router();

// Créer un sondage pour un événement (organisateur)
router.post(
  '/events/:eventId/polls',
  authMiddleware,
  requireEventOrganizer,
  pollsController.validateCreatePoll,
  pollsController.createEventPoll
);

// Lister les sondages d'un événement (participants)
router.get(
  '/events/:eventId/polls',
  authMiddleware,
  requireEventParticipantForPoll,
  pollsController.listEventPolls
);

// Ajouter une question à un sondage (organisateur)
router.post(
  '/polls/:pollId/questions',
  authMiddleware,
  requirePollOrganizer,
  pollsController.validateCreateQuestion,
  pollsController.addQuestion
);

// Ajouter une option à une question (organisateur)
router.post(
  '/questions/:questionId/options',
  authMiddleware,
  requireOrganizerByQuestionId,
  pollsController.validateCreateOption,
  pollsController.addOption
);

// Voter pour une option (participant)
router.post(
  '/questions/:questionId/votes',
  authMiddleware,
  pollsController.validateVote,
  pollsController.voteOnQuestion
);

module.exports = router;

