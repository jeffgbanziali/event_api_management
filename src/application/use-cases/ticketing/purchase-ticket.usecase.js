const ticketTypeRepository = require('../../../infrastructure/mongoose/repositories/ticket-type.repository');
const ticketRepository = require('../../../infrastructure/mongoose/repositories/ticket.repository');
const eventRepository = require('../../../infrastructure/mongoose/repositories/event.repository');
const eventParticipantRepository = require('../../../infrastructure/mongoose/repositories/event-participant.repository');

async function purchaseTicket(input, currentUserId) {
  const ticketType = await ticketTypeRepository.findById(input.ticketTypeId);
  if (!ticketType) {
    const error = new Error('Ticket type not found');
    error.status = 404;
    throw error;
  }

  const event = await eventRepository.findById(ticketType.event);
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

  if (event.visibility === 'private') {
    if (!currentUserId) {
      const error = new Error('Authentication required to purchase tickets for private events');
      error.status = 401;
      throw error;
    }
    const participant = await eventParticipantRepository.findParticipant(event.id, currentUserId);
    if (!participant) {
      const error = new Error('Only event participants can purchase tickets for this private event');
      error.status = 403;
      throw error;
    }
  }

  if (ticketType.soldCount >= ticketType.quantity) {
    const error = new Error('No more tickets available for this type');
    error.status = 409;
    throw error;
  }

  const ticket = await ticketRepository.create({
    eventId: ticketType.event,
    ticketTypeId: ticketType.id,
    buyerEmail: input.buyerEmail,
    buyerFirstName: input.buyerFirstName,
    buyerLastName: input.buyerLastName,
    buyerAddress: input.buyerAddress,
  });

  await ticketTypeRepository.incrementSoldCount(ticketType.id, 1);

  return ticket;
}

module.exports = {
  purchaseTicket,
};

