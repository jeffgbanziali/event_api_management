const CommentModel = require('../models/comment.model');

class CommentRepository {
  async create({ photoId, authorId, content }) {
    const comment = new CommentModel({
      photo: photoId,
      author: authorId,
      content,
    });
    return comment.save();
  }

  async findById(id) {
    return CommentModel.findById(id).exec();
  }

  async listForPhoto(photoId) {
    return CommentModel.find({ photo: photoId })
      .sort({ createdAt: 1 })
      .populate('author', 'firstName lastName avatarUrl')
      .exec();
  }

  async updateById(id, data) {
    return CommentModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
  }

  async deleteById(id) {
    return CommentModel.findByIdAndDelete(id).exec();
  }

  async deleteByPhotoId(photoId) {
    return CommentModel.deleteMany({ photo: photoId }).exec();
  }
}

module.exports = new CommentRepository();

