const { validate } = require('../../../validation/middlewares/validate.middleware');
const {
  createEventSchema,
  updateEventSchema,
  addParticipantSchema,
} = require('../../../validation/schemas/event.validation');
const { createEvent } = require('../../../application/use-cases/events/create-event.usecase');
const { addParticipant } = require('../../../application/use-cases/events/add-participant.usecase');
const { updateEvent } = require('../../../application/use-cases/events/update-event.usecase');
const { deleteEvent } = require('../../../application/use-cases/events/delete-event.usecase');
const { removeParticipant } = require('../../../application/use-cases/events/remove-participant.usecase');
const eventRepository = require('../../../infrastructure/mongoose/repositories/event.repository');
const eventParticipantRepository = require('../../../infrastructure/mongoose/repositories/event-participant.repository');

const validateCreateEvent = validate(createEventSchema);
const validateUpdateEvent = validate(updateEventSchema);
const validateAddParticipant = validate(addParticipantSchema);

async function create(req, res, next) {
  try {
    const event = await createEvent(req.body, req.user.id);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
}

async function createInGroup(req, res, next) {
  try {
    const event = await createEvent(req.body, req.user.id, { groupId: req.params.groupId });
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const events = await eventRepository.listVisibleForUser(req.user.id);
    res.json(events);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const event = await eventRepository.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    const participant = await eventParticipantRepository.findParticipant(req.params.eventId, req.user.id);
    if (event.visibility === 'private' && !participant) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const event = await updateEvent(req.params.eventId, req.body);
    res.json(event);
  } catch (err) {
    next(err);
  }
}

async function deleteEventHandler(req, res, next) {
  try {
    await deleteEvent(req.params.eventId);
    res.status(200).json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

async function addParticipantHandler(req, res, next) {
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

async function listParticipants(req, res, next) {
  try {
    const participants = await eventParticipantRepository.listParticipants(req.params.eventId);
    res.json(participants);
  } catch (err) {
    next(err);
  }
}

async function removeParticipantHandler(req, res, next) {
  try {
    await removeParticipant(req.params.eventId, req.params.userId);
    res.status(200).json({ removed: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCreateEvent,
  validateUpdateEvent,
  validateAddParticipant,
  create,
  createInGroup,
  list,
  getById,
  update,
  deleteEventHandler,
  addParticipantHandler,
  listParticipants,
  removeParticipantHandler,
};
