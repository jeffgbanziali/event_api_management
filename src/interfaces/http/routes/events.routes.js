const express = require('express');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const {
  requireEventOrganizer,
  requireEventOrganizerOrSelf,
  requireEventParticipant,
  requireCanCreateEventInGroup,
} = require('../../../middlewares/authorization.middleware');
const eventsController = require('../controllers/events.controller');

const router = express.Router();

router.post('/', authMiddleware, eventsController.validateCreateEvent, eventsController.create);
router.post(
  '/groups/:groupId',
  authMiddleware,
  requireCanCreateEventInGroup,
  eventsController.validateCreateEvent,
  eventsController.createInGroup
);

router.get('/', authMiddleware, eventsController.list);
router.get('/:eventId', authMiddleware, eventsController.getById);
router.patch('/:eventId', authMiddleware, requireEventOrganizer, eventsController.validateUpdateEvent, eventsController.update);
router.delete('/:eventId', authMiddleware, requireEventOrganizer, eventsController.deleteEventHandler);

router.post(
  '/:eventId/participants',
  authMiddleware,
  requireEventOrganizer,
  eventsController.validateAddParticipant,
  eventsController.addParticipantHandler
);
router.get('/:eventId/participants', authMiddleware, requireEventParticipant, eventsController.listParticipants);
router.delete('/:eventId/participants/:userId', authMiddleware, requireEventOrganizerOrSelf, eventsController.removeParticipantHandler);

module.exports = router;
