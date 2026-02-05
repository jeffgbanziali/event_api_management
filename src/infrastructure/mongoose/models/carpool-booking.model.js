const mongoose = require('mongoose');

const carpoolBookingSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CarpoolRide',
      required: true,
      index: true,
    },
    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

carpoolBookingSchema.index({ ride: 1, passenger: 1 }, { unique: true });

const CarpoolBookingModel = mongoose.model('CarpoolBooking', carpoolBookingSchema);

module.exports = CarpoolBookingModel;
