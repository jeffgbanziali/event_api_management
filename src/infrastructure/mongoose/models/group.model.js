const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
    },
    coverPhotoUrl: {
      type: String,
    },
    type: {
      type: String,
      enum: ['public', 'private', 'secret'],
      required: true,
      default: 'public',
      index: true,
    },
    allowMembersToPost: {
      type: Boolean,
      default: true,
    },
    allowMembersToCreateEvents: {
      type: Boolean,
      default: false,
    },
    createdBy: {
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

const GroupModel = mongoose.model('Group', groupSchema);

module.exports = GroupModel;

