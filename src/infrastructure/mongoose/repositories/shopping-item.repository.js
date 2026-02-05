const ShoppingItemModel = require('../models/shopping-item.model');

class ShoppingItemRepository {
  async create({ eventId, userId, name, quantity, arrivalTime }) {
    const item = new ShoppingItemModel({
      event: eventId,
      user: userId,
      name,
      quantity,
      arrivalTime,
    });
    return item.save();
  }

  async findById(id) {
    return ShoppingItemModel.findById(id).exec();
  }

  async listForEvent(eventId) {
    return ShoppingItemModel.find({ event: eventId })
      .populate('user', 'firstName lastName')
      .sort({ arrivalTime: 1 })
      .exec();
  }

  async delete(id) {
    return ShoppingItemModel.findByIdAndDelete(id).exec();
  }
}

module.exports = new ShoppingItemRepository();
