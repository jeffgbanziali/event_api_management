const eventRepository = require('../../../infrastructure/mongoose/repositories/event.repository');
const shoppingItemRepository = require('../../../infrastructure/mongoose/repositories/shopping-item.repository');

async function addShoppingItem(input, currentUserId) {
  const event = await eventRepository.findById(input.eventId);
  if (!event) {
    const error = new Error('Event not found');
    error.status = 404;
    throw error;
  }

  if (!event.settings?.shoppingListEnabled) {
    const error = new Error('Shopping list is not enabled for this event');
    error.status = 400;
    throw error;
  }

  const item = await shoppingItemRepository.create({
    eventId: input.eventId,
    userId: currentUserId,
    name: input.name,
    quantity: input.quantity,
    arrivalTime: input.arrivalTime,
  });

  return item;
}

module.exports = {
  addShoppingItem,
};
