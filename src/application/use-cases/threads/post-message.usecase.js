const threadRepository = require('../../../infrastructure/mongoose/repositories/thread.repository');
const messageRepository = require('../../../infrastructure/mongoose/repositories/message.repository');

async function postMessage(input, currentUserId) {
  const thread = await threadRepository.findById(input.threadId);
  if (!thread) {
    const error = new Error('Thread not found');
    error.status = 404;
    throw error;
  }

  const message = await messageRepository.create({
    threadId: input.threadId,
    authorId: currentUserId,
    content: input.content,
    parentMessageId: input.parentMessageId || null,
  });

  return message;
}

module.exports = {
  postMessage,
};

