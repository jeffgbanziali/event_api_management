// Routes sondages : création (organisateur), liste/vote/résultats (participant), CRUD question/option (organisateur)
const express = require('express');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const {
  requireEventOrganizer,
  requireEventParticipantForPoll,
  requireEventParticipantByPollId,
  requirePollOrganizer,
  requireOrganizerByQuestionId,
  requireOrganizerByOptionId,
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

// Modifier / supprimer un sondage (organisateur)
router.patch(
  '/polls/:pollId',
  authMiddleware,
  requirePollOrganizer,
  pollsController.validateUpdatePoll,
  pollsController.updateEventPoll
);
router.delete(
  '/polls/:pollId',
  authMiddleware,
  requirePollOrganizer,
  pollsController.deleteEventPoll
);

// Ajouter une question à un sondage (organisateur)
router.post(
  '/polls/:pollId/questions',
  authMiddleware,
  requirePollOrganizer,
  pollsController.validateCreateQuestion,
  pollsController.addQuestion
);

// Modifier / supprimer une question (organisateur)
router.patch(
  '/questions/:questionId',
  authMiddleware,
  requireOrganizerByQuestionId,
  pollsController.validateUpdateQuestion,
  pollsController.updatePollQuestion
);
router.delete(
  '/questions/:questionId',
  authMiddleware,
  requireOrganizerByQuestionId,
  pollsController.deletePollQuestion
);

// Ajouter une option à une question (organisateur)
router.post(
  '/questions/:questionId/options',
  authMiddleware,
  requireOrganizerByQuestionId,
  pollsController.validateCreateOption,
  pollsController.addOption
);

// Modifier / supprimer une option (organisateur)
router.patch(
  '/options/:optionId',
  authMiddleware,
  requireOrganizerByOptionId,
  pollsController.validateUpdateOption,
  pollsController.updateQuestionOption
);
router.delete(
  '/options/:optionId',
  authMiddleware,
  requireOrganizerByOptionId,
  pollsController.deleteQuestionOption
);

// Voter pour une option (participant)
router.post(
  '/questions/:questionId/votes',
  authMiddleware,
  pollsController.validateVote,
  pollsController.voteOnQuestion
);

// Résultats agrégés d'un sondage (participants)
router.get(
  '/polls/:pollId/results',
  authMiddleware,
  requireEventParticipantByPollId,
  pollsController.getResults
);

module.exports = router;

