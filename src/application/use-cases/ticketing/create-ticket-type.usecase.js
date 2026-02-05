const eventRepository = require('../../../infrastructure/mongoose/repositories/event.repository');
const ticketTypeRepository = require('../../../infrastructure/mongoose/repositories/ticket-type.repository');

async function createTicketType(input, currentUserId) {
  const event = await eventRepository.findById(input.eventId);
  if (!event) {
    const error = new Error('Event not found');
    error.status = 404;
    throw error;
  }

  if (!event.settings?.ticketingEnabled) {
    const error = new Error('Ticketing is not enabled for this event');
    error.status = 400;
    throw error;
  }

  const ticketType = await ticketTypeRepository.create({
    eventId: input.eventId,
    name: input.name,
    price: input.price,
    currency: input.currency,
    quantity: input.quantity,
    createdBy: currentUserId,
  });

  return ticketType;
}

module.exports = {
  createTicketType,
};

