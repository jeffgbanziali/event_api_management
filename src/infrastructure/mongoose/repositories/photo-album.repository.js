const PhotoAlbumModel = require('../models/photo-album.model');

class PhotoAlbumRepository {
  async create({ eventId, name, description, createdBy }) {
    const album = new PhotoAlbumModel({
      event: eventId,
      name,
      description,
      createdBy,
    });
    return album.save();
  }

  async findById(id) {
    return PhotoAlbumModel.findById(id).exec();
  }

  async listForEvent(eventId) {
    return PhotoAlbumModel.find({ event: eventId }).exec();
  }
}

module.exports = new PhotoAlbumRepository();

