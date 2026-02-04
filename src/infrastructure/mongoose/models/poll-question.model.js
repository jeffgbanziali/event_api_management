const mongoose = require('mongoose');

const pollQuestionSchema = new mongoose.Schema(
  {
    poll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Poll',
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const PollQuestionModel = mongoose.model('PollQuestion', pollQuestionSchema);

module.exports = PollQuestionModel;

