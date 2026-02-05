const commentRepository = require('../../../infrastructure/mongoose/repositories/comment.repository');

async function deleteComment(commentId) {
  const comment = await commentRepository.findById(commentId);
  if (!comment) {
    const error = new Error('Comment not found');
    error.status = 404;
    throw error;
  }

  await commentRepository.deleteById(commentId);
  return { deleted: true };
}

module.exports = {
  deleteComment,
};
