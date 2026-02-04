const mongoose = require('mongoose');

const eventParticipantSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['participant', 'organizer'],
      default: 'participant',
      index: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

eventParticipantSchema.index({ event: 1, user: 1 }, { unique: true });

const EventParticipantModel = mongoose.model('EventParticipant', eventParticipantSchema);

module.exports = EventParticipantModel;

