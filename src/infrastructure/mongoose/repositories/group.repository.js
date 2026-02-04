const GroupModel = require('../models/group.model');

class GroupRepository {
  async create(data) {
    const group = new GroupModel(data);
    return group.save();
  }

  async findById(id) {
    return GroupModel.findById(id).exec();
  }

  async listVisibleForUser(userId) {
    // Pour l'instant, on renvoie tous les groupes publics.
    // Plus tard on pourra affiner (membre, privé, secret).
    return GroupModel.find({ type: 'public' }).exec();
  }
}

module.exports = new GroupRepository();

