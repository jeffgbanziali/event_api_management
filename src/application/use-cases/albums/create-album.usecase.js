const eventRepository = require('../../../infrastructure/mongoose/repositories/event.repository');
const photoAlbumRepository = require('../../../infrastructure/mongoose/repositories/photo-album.repository');

async function createAlbumForEvent(input, currentUserId) {
  const event = await eventRepository.findById(input.eventId);
  if (!event) {
    const error = new Error('Event not found');
    error.status = 404;
    throw error;
  }

  const album = await photoAlbumRepository.create({
    eventId: input.eventId,
    name: input.name,
    description: input.description,
    createdBy: currentUserId,
  });

  return album;
}

module.exports = {
  createAlbumForEvent,
};

