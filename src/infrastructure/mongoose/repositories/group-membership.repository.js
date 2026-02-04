const GroupMembershipModel = require('../models/group-membership.model');

class GroupMembershipRepository {
  async addMember({ groupId, userId, role }) {
    const membership = new GroupMembershipModel({
      group: groupId,
      user: userId,
      role: role || 'member',
    });
    return membership.save();
  }

  async findMembership(groupId, userId) {
    return GroupMembershipModel.findOne({ group: groupId, user: userId }).exec();
  }

  async isGroupAdmin(groupId, userId) {
    const membership = await GroupMembershipModel.findOne({
      group: groupId,
      user: userId,
      role: 'admin',
    }).exec();
    return !!membership;
  }

  async listMembers(groupId) {
    return GroupMembershipModel.find({ group: groupId })
      .populate('user', 'firstName lastName email avatarUrl')
      .exec();
  }
}

module.exports = new GroupMembershipRepository();

