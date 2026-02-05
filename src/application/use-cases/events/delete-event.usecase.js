const eventRepository = require('../../../infrastructure/mongoose/repositories/event.repository');

async function deleteEvent(eventId) {
  const event = await eventRepository.findById(eventId);
  if (!event) {
    const error = new Error('Event not found');
    error.status = 404;
    throw error;
  }
  await eventRepository.deleteById(eventId);
  return { deleted: true };
}

module.exports = {
  deleteEvent,
};
