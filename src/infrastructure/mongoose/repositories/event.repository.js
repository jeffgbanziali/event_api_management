const EventModel = require('../models/event.model');

class EventRepository {
  async create(data) {
    const event = new EventModel(data);
    return event.save();
  }

  async findById(id) {
    return EventModel.findById(id).exec();
  }

  async listPublic() {
    return EventModel.find({ visibility: 'public' }).exec();
  }
}

module.exports = new EventRepository();

