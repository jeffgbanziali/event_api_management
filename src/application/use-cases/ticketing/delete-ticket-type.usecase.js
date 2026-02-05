const ticketTypeRepository = require('../../../infrastructure/mongoose/repositories/ticket-type.repository');

async function deleteTicketType(ticketTypeId, eventId) {
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

  if (ticketType.soldCount > 0) {
    const error = new Error('Cannot delete ticket type with existing sales');
    error.status = 409;
    throw error;
  }

  await ticketTypeRepository.deleteById(ticketTypeId);
  return { deleted: true };
}

module.exports = {
  deleteTicketType,
};
