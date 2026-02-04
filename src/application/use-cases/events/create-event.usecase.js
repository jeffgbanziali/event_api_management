const eventRepository = require('../../../infrastructure/mongoose/repositories/event.repository');
const eventParticipantRepository = require('../../../infrastructure/mongoose/repositories/event-participant.repository');

async function createEvent(input, currentUserId, context = {}) {
  const event = await eventRepository.create({
    name: input.name,
    description: input.description,
    startDate: input.startDate,
    endDate: input.endDate,
    location: input.location,
    coverPhotoUrl: input.coverPhotoUrl,
    visibility: input.visibility,
    group: context.groupId || null,
    createdBy: currentUserId,
    settings: input.settings || {},
  });

  // Le créateur devient automatiquement organisateur
  await eventParticipantRepository.addParticipant({
    eventId: event.id,
    userId: currentUserId,
    role: 'organizer',
  });

  return event;
}

module.exports = {
  createEvent,
};

