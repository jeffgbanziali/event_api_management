const EventParticipantModel = require('../models/event-participant.model');

class EventParticipantRepository {
  async addParticipant({ eventId, userId, role }) {
    const participant = new EventParticipantModel({
      event: eventId,
      user: userId,
      role: role || 'participant',
    });
    return participant.save();
  }

  async findParticipant(eventId, userId) {
    return EventParticipantModel.findOne({ event: eventId, user: userId }).exec();
  }

  async isOrganizer(eventId, userId) {
    const participant = await EventParticipantModel.findOne({
      event: eventId,
      user: userId,
      role: 'organizer',
    }).exec();
    return !!participant;
  }

  async listParticipants(eventId) {
    return EventParticipantModel.find({ event: eventId })
      .populate('user', 'firstName lastName email avatarUrl')
      .exec();
  }

  async removeParticipant(eventId, userId) {
    return EventParticipantModel.findOneAndDelete({ event: eventId, user: userId }).exec();
  }
}

module.exports = new EventParticipantRepository();

