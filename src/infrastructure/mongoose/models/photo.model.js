const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PhotoAlbum',
      required: true,
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const PhotoModel = mongoose.model('Photo', photoSchema);

module.exports = PhotoModel;

