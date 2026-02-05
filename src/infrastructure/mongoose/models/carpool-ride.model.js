const mongoose = require('mongoose');

const carpoolRideSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    departurePlace: {
      type: String,
      required: true,
      trim: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'EUR',
    },
    seatsAvailable: {
      type: Number,
      required: true,
      min: 1,
    },
    maxDetourMinutes: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const CarpoolRideModel = mongoose.model('CarpoolRide', carpoolRideSchema);

module.exports = CarpoolRideModel;
