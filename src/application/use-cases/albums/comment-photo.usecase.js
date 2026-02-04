const photoRepository = require('../../../infrastructure/mongoose/repositories/photo.repository');
const commentRepository = require('../../../infrastructure/mongoose/repositories/comment.repository');

async function commentPhoto(input, currentUserId) {
  const photo = await photoRepository.findById(input.photoId);
  if (!photo) {
    const error = new Error('Photo not found');
    error.status = 404;
    throw error;
  }

  const comment = await commentRepository.create({
    photoId: input.photoId,
    authorId: currentUserId,
    content: input.content,
  });

  return comment;
}

module.exports = {
  commentPhoto,
};

