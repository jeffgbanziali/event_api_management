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

  async listForPhoto(photoId) {
    return CommentModel.find({ photo: photoId })
      .sort({ createdAt: 1 })
      .populate('author', 'firstName lastName avatarUrl')
      .exec();
  }
}

module.exports = new CommentRepository();

