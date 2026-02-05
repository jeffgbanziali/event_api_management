const PhotoModel = require('../models/photo.model');

class PhotoRepository {
  async create({ albumId, eventId, uploadedBy, url, caption }) {
    const photo = new PhotoModel({
      album: albumId,
      event: eventId,
      uploadedBy,
      url,
      caption,
    });
    return photo.save();
  }

  async findById(id) {
    return PhotoModel.findById(id).exec();
  }

  async listForAlbum(albumId) {
    return PhotoModel.find({ album: albumId })
      .sort({ createdAt: 1 })
      .exec();
  }

  async updateById(id, data) {
    return PhotoModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
  }

  async deleteById(id) {
    return PhotoModel.findByIdAndDelete(id).exec();
  }

  async deleteByAlbumId(albumId) {
    return PhotoModel.deleteMany({ album: albumId }).exec();
  }
}

module.exports = new PhotoRepository();

