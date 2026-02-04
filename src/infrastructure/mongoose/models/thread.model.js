const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Validateur pour s'assurer qu'un thread est lié soit à un group soit à un event, mais pas les deux
threadSchema.pre('validate', function validateThread(next) {
  if ((this.group && this.event) || (!this.group && !this.event)) {
    return next(new Error('Thread must be linked to exactly one of group or event'));
  }
  return next();
});

const ThreadModel = mongoose.model('Thread', threadSchema);

module.exports = ThreadModel;

