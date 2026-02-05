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

  async updateById(id, data) {
    return PhotoAlbumModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
  }

  async deleteById(id) {
    return PhotoAlbumModel.findByIdAndDelete(id).exec();
  }
}

module.exports = new PhotoAlbumRepository();

