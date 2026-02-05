const photoRepository = require('../../../infrastructure/mongoose/repositories/photo.repository');
const commentRepository = require('../../../infrastructure/mongoose/repositories/comment.repository');

async function deletePhoto(photoId) {
  const photo = await photoRepository.findById(photoId);
  if (!photo) {
    const error = new Error('Photo not found');
    error.status = 404;
    throw error;
  }

  await commentRepository.deleteByPhotoId(photoId);
  await photoRepository.deleteById(photoId);
  return { deleted: true };
}

module.exports = {
  deletePhoto,
};
