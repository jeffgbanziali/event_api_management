const ThreadModel = require('../models/thread.model');

class ThreadRepository {
  async createForEvent({ eventId, title, createdBy }) {
    const thread = new ThreadModel({
      event: eventId,
      title,
      createdBy,
    });
    return thread.save();
  }

  async listForEvent(eventId) {
    return ThreadModel.find({ event: eventId }).exec();
  }

  async findById(id) {
    return ThreadModel.findById(id).exec();
  }
}

module.exports = new ThreadRepository();

