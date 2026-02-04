const express = require('express');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const { validate } = require('../../../validation/middlewares/validate.middleware');
const {
  createEventSchema,
  addParticipantSchema,
} = require('../../../validation/schemas/event.validation');
const { createEvent } = require('../../../application/use-cases/events/create-event.usecase');
const { addParticipant } = require('../../../application/use-cases/events/add-participant.usecase');
const eventRepository = require('../../../infrastructure/mongoose/repositories/event.repository');
const eventParticipantRepository = require('../../../infrastructure/mongoose/repositories/event-participant.repository');
const {
  requireEventOrganizer,
  requireEventParticipant,
  requireCanCreateEventInGroup,
} = require('../../../middlewares/authorization.middleware');

const router = express.Router();

// Créer un événement sans groupe
router.post('/', authMiddleware, validate(createEventSchema), async (req, res, next) => {
  try {
    const event = await createEvent(req.body, req.user.id);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
});

// Créer un événement dans un groupe
router.post(
  '/groups/:groupId',
  authMiddleware,
  requireCanCreateEventInGroup,
  validate(createEventSchema),
  async (req, res, next) => {
    try {
      const event = await createEvent(req.body, req.user.id, { groupId: req.params.groupId });
      res.status(201).json(event);
    } catch (err) {
      next(err);
    }
  }
);

// Lister les événements publics
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const events = await eventRepository.listPublic();
    res.json(events);
  } catch (err) {
    next(err);
  }
});

// Détails d'un événement
router.get('/:eventId', authMiddleware, async (req, res, next) => {
  try {
    const event = await eventRepository.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    // TODO: appliquer les règles de visibilité private/public
    return res.json(event);
  } catch (err) {
    return next(err);
  }
});

// Ajouter un participant / organisateur (organisateurs uniquement)
router.post(
  '/:eventId/participants',
  authMiddleware,
  requireEventOrganizer,
  validate(addParticipantSchema),
  async (req, res, next) => {
    try {
      const participant = await addParticipant({
        eventId: req.params.eventId,
        userId: req.body.userId,
        role: req.body.role,
      });
      res.status(201).json(participant);
    } catch (err) {
      next(err);
    }
  }
);

// Lister les participants d'un événement (participants/organisateurs)
router.get('/:eventId/participants', authMiddleware, requireEventParticipant, async (req, res, next) => {
  try {
    const participants = await eventParticipantRepository.listParticipants(req.params.eventId);
    res.json(participants);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

