const photoAlbumRepository = require('../../../infrastructure/mongoose/repositories/photo-album.repository');
const photoRepository = require('../../../infrastructure/mongoose/repositories/photo.repository');

async function uploadPhotoToAlbum(input, currentUserId) {
  const album = await photoAlbumRepository.findById(input.albumId);
  if (!album) {
    const error = new Error('Album not found');
    error.status = 404;
    throw error;
  }

  const photo = await photoRepository.create({
    albumId: input.albumId,
    eventId: album.event,
    uploadedBy: currentUserId,
    url: input.url,
    caption: input.caption,
  });

  return photo;
}

module.exports = {
  uploadPhotoToAlbum,
};

