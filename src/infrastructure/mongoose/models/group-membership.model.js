const mongoose = require('mongoose');

const groupMembershipSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
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
      enum: ['member', 'admin'],
      default: 'member',
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

groupMembershipSchema.index({ group: 1, user: 1 }, { unique: true });

const GroupMembershipModel = mongoose.model('GroupMembership', groupMembershipSchema);

module.exports = GroupMembershipModel;

