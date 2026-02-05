const photoAlbumRepository = require('../../../infrastructure/mongoose/repositories/photo-album.repository');

async function updateAlbum(albumId, data) {
  const album = await photoAlbumRepository.findById(albumId);
  if (!album) {
    const error = new Error('Album not found');
    error.status = 404;
    throw error;
  }

  const updated = await photoAlbumRepository.updateById(albumId, {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.description !== undefined && { description: data.description }),
  });
  return updated;
}

module.exports = {
  updateAlbum,
};
