const ticketTypeRepository = require('../../../infrastructure/mongoose/repositories/ticket-type.repository');
const ticketRepository = require('../../../infrastructure/mongoose/repositories/ticket.repository');

async function purchaseTicket(input) {
  const ticketType = await ticketTypeRepository.findById(input.ticketTypeId);
  if (!ticketType) {
    const error = new Error('Ticket type not found');
    error.status = 404;
    throw error;
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

