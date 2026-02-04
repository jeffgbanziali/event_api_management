const eventRepository = require('../../../infrastructure/mongoose/repositories/event.repository');
const pollRepository = require('../../../infrastructure/mongoose/repositories/poll.repository');

async function createPoll(input, currentUserId) {
  const event = await eventRepository.findById(input.eventId);
  if (!event) {
    const error = new Error('Event not found');
    error.status = 404;
    throw error;
  }

  const poll = await pollRepository.createPoll({
    eventId: input.eventId,
    title: input.title,
    createdBy: currentUserId,
  });

  return poll;
}

module.exports = {
  createPoll,
};

