const ticketTypeRepository = require('../../../infrastructure/mongoose/repositories/ticket-type.repository');

async function updateTicketType(ticketTypeId, data, eventId) {
  const ticketType = await ticketTypeRepository.findById(ticketTypeId);
  if (!ticketType) {
    const error = new Error('Ticket type not found');
    error.status = 404;
    throw error;
  }
  if (eventId && ticketType.event.toString() !== eventId) {
    const error = new Error('Ticket type does not belong to this event');
    error.status = 404;
    throw error;
  }

  if (data.quantity !== undefined && data.quantity < ticketType.soldCount) {
    const error = new Error('Quantity cannot be less than already sold count');
    error.status = 400;
    throw error;
  }

  const updated = await ticketTypeRepository.updateById(ticketTypeId, {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.price !== undefined && { price: data.price }),
    ...(data.currency !== undefined && { currency: data.currency }),
    ...(data.quantity !== undefined && { quantity: data.quantity }),
  });
  return updated;
}

module.exports = {
  updateTicketType,
};
