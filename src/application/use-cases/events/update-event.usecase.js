const eventRepository = require('../../../infrastructure/mongoose/repositories/event.repository');

async function updateEvent(eventId, data) {
  const event = await eventRepository.findById(eventId);
  if (!event) {
    const error = new Error('Event not found');
    error.status = 404;
    throw error;
  }
  const updated = await eventRepository.updateById(eventId, {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.startDate !== undefined && { startDate: data.startDate }),
    ...(data.endDate !== undefined && { endDate: data.endDate }),
    ...(data.location !== undefined && { location: data.location }),
    ...(data.coverPhotoUrl !== undefined && { coverPhotoUrl: data.coverPhotoUrl }),
    ...(data.visibility !== undefined && { visibility: data.visibility }),
    ...(data.settings !== undefined && { settings: data.settings }),
  });
  return updated;
}

module.exports = {
  updateEvent,
};
