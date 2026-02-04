const mongoose = require('mongoose');

const pollResponseSchema = new mongoose.Schema(
  {
    poll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Poll',
      required: true,
      index: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PollQuestion',
      required: true,
      index: true,
    },
    option: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PollOption',
      required: true,
      index: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Un participant ne peut répondre qu'une seule fois à une question
pollResponseSchema.index({ question: 1, participant: 1 }, { unique: true });

const PollResponseModel = mongoose.model('PollResponse', pollResponseSchema);

module.exports = PollResponseModel;

