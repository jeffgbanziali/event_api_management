// Accès base de données pour les groupes (CRUD, liste visible selon type et appartenance)
const GroupModel = require('../models/group.model');
const GroupMembershipModel = require('../models/group-membership.model');

class GroupRepository {
  async create(data) {
    const group = new GroupModel(data);
    return group.save();
  }

  async findById(id) {
    return GroupModel.findById(id).exec();
  }

  async updateById(id, data) {
    return GroupModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
  }

  async deleteById(id) {
    return GroupModel.findByIdAndDelete(id).exec();
  }

  async listVisibleForUser(userId) {
    const memberGroupIds = await GroupMembershipModel.distinct('group', { user: userId }).exec();
    return GroupModel.find({
      $or: [{ type: 'public' }, { _id: { $in: memberGroupIds } }],
    }).exec();
  }
}

module.exports = new GroupRepository();

