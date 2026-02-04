const threadRepository = require('../../../infrastructure/mongoose/repositories/thread.repository');
const eventRepository = require('../../../infrastructure/mongoose/repositories/event.repository');

async function createEventThread(input, currentUserId) {
  const event = await eventRepository.findById(input.eventId);
  if (!event) {
    const error = new Error('Event not found');
    error.status = 404;
    throw error;
  }

  const thread = await threadRepository.createForEvent({
    eventId: input.eventId,
    title: input.title,
    createdBy: currentUserId,
  });

  return thread;
}

module.exports = {
  createEventThread,
};

