const photoRepository = require('../../../infrastructure/mongoose/repositories/photo.repository');

async function updatePhoto(photoId, data) {
  const photo = await photoRepository.findById(photoId);
  if (!photo) {
    const error = new Error('Photo not found');
    error.status = 404;
    throw error;
  }

  const updated = await photoRepository.updateById(photoId, {
    ...(data.url !== undefined && { url: data.url }),
    ...(data.caption !== undefined && { caption: data.caption }),
  });
  return updated;
}

module.exports = {
  updatePhoto,
};
