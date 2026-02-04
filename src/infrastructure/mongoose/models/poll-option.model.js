const mongoose = require('mongoose');

const pollOptionSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PollQuestion',
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

const PollOptionModel = mongoose.model('PollOption', pollOptionSchema);

module.exports = PollOptionModel;

