const eventRepository = require('../../../infrastructure/mongoose/repositories/event.repository');
const shoppingItemRepository = require('../../../infrastructure/mongoose/repositories/shopping-item.repository');

async function listShoppingItems(eventId) {
  const event = await eventRepository.findById(eventId);
  if (!event) {
    const error = new Error('Event not found');
    error.status = 404;
    throw error;
  }

  return shoppingItemRepository.listForEvent(eventId);
}

module.exports = {
  listShoppingItems,
};
