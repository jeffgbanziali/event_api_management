const EventModel = require('../models/event.model');
const EventParticipantModel = require('../models/event-participant.model');

class EventRepository {
  async create(data) {
    const event = new EventModel(data);
    return event.save();
  }

  async findById(id) {
    return EventModel.findById(id).exec();
  }

  async updateById(id, data) {
    return EventModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
  }

  async deleteById(id) {
    return EventModel.findByIdAndDelete(id).exec();
  }

  async listPublic() {
    return EventModel.find({ visibility: 'public' }).exec();
  }

  async listVisibleForUser(userId) {
    const participantEventIds = await EventParticipantModel.distinct('event', { user: userId }).exec();
    return EventModel.find({
      $or: [{ visibility: 'public' }, { _id: { $in: participantEventIds } }],
    }).sort({ startDate: 1 }).exec();
  }
}

module.exports = new EventRepository();

