const commentRepository = require('../../../infrastructure/mongoose/repositories/comment.repository');

async function updateComment(commentId, data) {
  const comment = await commentRepository.findById(commentId);
  if (!comment) {
    const error = new Error('Comment not found');
    error.status = 404;
    throw error;
  }

  const updated = await commentRepository.updateById(commentId, {
    ...(data.content !== undefined && { content: data.content }),
  });
  return updated;
}

module.exports = {
  updateComment,
};
