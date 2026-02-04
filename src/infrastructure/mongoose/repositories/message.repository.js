const MessageModel = require('../models/message.model');

class MessageRepository {
  async create({ threadId, authorId, content, parentMessageId }) {
    const message = new MessageModel({
      thread: threadId,
      author: authorId,
      content,
      parentMessage: parentMessageId || null,
    });
    return message.save();
  }

  async listForThread(threadId) {
    return MessageModel.find({ thread: threadId })
      .sort({ createdAt: 1 })
      .populate('author', 'firstName lastName avatarUrl')
      .exec();
  }

  async findById(id) {
    return MessageModel.findById(id).exec();
  }
}

module.exports = new MessageRepository();

