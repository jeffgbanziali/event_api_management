const shoppingItemRepository = require('../../../infrastructure/mongoose/repositories/shopping-item.repository');
const eventParticipantRepository = require('../../../infrastructure/mongoose/repositories/event-participant.repository');

async function removeShoppingItem(itemId, currentUserId) {
  const item = await shoppingItemRepository.findById(itemId);
  if (!item) {
    const error = new Error('Shopping item not found');
    error.status = 404;
    throw error;
  }

  // Seul le créateur de l'item ou un organisateur peut supprimer
  const isOrganizer = await eventParticipantRepository.isOrganizer(item.event, currentUserId);
  const isOwner = item.user.toString() === currentUserId;

  if (!isOwner && !isOrganizer) {
    const error = new Error('Forbidden: only item owner or event organizer can remove this item');
    error.status = 403;
    throw error;
  }

  await shoppingItemRepository.delete(itemId);
  return { deleted: true };
}

module.exports = {
  removeShoppingItem,
};
