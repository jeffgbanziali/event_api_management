const TicketModel = require('../models/ticket.model');

class TicketRepository {
  async create({
    eventId,
    ticketTypeId,
    buyerEmail,
    buyerFirstName,
    buyerLastName,
    buyerAddress,
  }) {
    const ticket = new TicketModel({
      event: eventId,
      ticketType: ticketTypeId,
      buyerEmail,
      buyerFirstName,
      buyerLastName,
      buyerAddress,
    });
    return ticket.save();
  }

  async listForEvent(eventId) {
    return TicketModel.find({ event: eventId }).exec();
  }
}

module.exports = new TicketRepository();

