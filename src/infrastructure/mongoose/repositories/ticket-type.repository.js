const TicketTypeModel = require('../models/ticket-type.model');

class TicketTypeRepository {
  async create({ eventId, name, price, currency, quantity, createdBy }) {
    const ticketType = new TicketTypeModel({
      event: eventId,
      name,
      price,
      currency,
      quantity,
      soldCount: 0,
      createdBy,
    });
    return ticketType.save();
  }

  async findById(id) {
    return TicketTypeModel.findById(id).exec();
  }

  async listForEvent(eventId) {
    return TicketTypeModel.find({ event: eventId }).exec();
  }

  async incrementSoldCount(ticketTypeId, incrementBy = 1) {
    return TicketTypeModel.findByIdAndUpdate(
      ticketTypeId,
      { $inc: { soldCount: incrementBy } },
      { new: true }
    ).exec();
  }
}

module.exports = new TicketTypeRepository();

