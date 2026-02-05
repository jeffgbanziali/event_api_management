const photoAlbumRepository = require('../../../infrastructure/mongoose/repositories/photo-album.repository');
const photoRepository = require('../../../infrastructure/mongoose/repositories/photo.repository');

async function deleteAlbum(albumId) {
  const album = await photoAlbumRepository.findById(albumId);
  if (!album) {
    const error = new Error('Album not found');
    error.status = 404;
    throw error;
  }

  await photoRepository.deleteByAlbumId(albumId);
  await photoAlbumRepository.deleteById(albumId);
  return { deleted: true };
}

module.exports = {
  deleteAlbum,
};
