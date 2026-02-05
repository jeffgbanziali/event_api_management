const UserModel = require('../models/user.model');

class UserRepository {
  async findByEmail(email) {
    return UserModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async findById(id) {
    return UserModel.findById(id).exec();
  }

  async create(data) {
    const user = new UserModel(data);
    return user.save();
  }

  async updateById(id, data) {
    return UserModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
  }
}

module.exports = new UserRepository();

