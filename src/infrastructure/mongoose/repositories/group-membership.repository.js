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

  async updateRole(groupId, userId, role) {
    return GroupMembershipModel.findOneAndUpdate(
      { group: groupId, user: userId },
      { $set: { role } },
      { new: true }
    ).exec();
  }

  async removeMember(groupId, userId) {
    return GroupMembershipModel.findOneAndDelete({ group: groupId, user: userId }).exec();
  }
}

module.exports = new GroupMembershipRepository();

