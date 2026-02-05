const eventParticipantRepository = require('../../../infrastructure/mongoose/repositories/event-participant.repository');

async function removeParticipant(eventId, userId) {
  const participant = await eventParticipantRepository.findParticipant(eventId, userId);
  if (!participant) {
    const error = new Error('User is not a participant of this event');
    error.status = 404;
    throw error;
  }
  await eventParticipantRepository.removeParticipant(eventId, userId);
  return { removed: true };
}

module.exports = {
  removeParticipant,
};
