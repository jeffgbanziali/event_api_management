const eventRepository = require('../../../infrastructure/mongoose/repositories/event.repository');
const eventParticipantRepository = require('../../../infrastructure/mongoose/repositories/event-participant.repository');

async function addParticipant(input) {
  const event = await eventRepository.findById(input.eventId);
  if (!event) {
    const error = new Error('Event not found');
    error.status = 404;
    throw error;
  }

  const existing = await eventParticipantRepository.findParticipant(input.eventId, input.userId);
  if (existing) {
    const error = new Error('User is already participant of this event');
    error.status = 409;
    throw error;
  }

  const participant = await eventParticipantRepository.addParticipant({
    eventId: input.eventId,
    userId: input.userId,
    role: input.role || 'participant',
  });

  return participant;
}

module.exports = {
  addParticipant,
};

