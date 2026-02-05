const CarpoolBookingModel = require('../models/carpool-booking.model');

class CarpoolBookingRepository {
  async create({ rideId, passengerId }) {
    const booking = new CarpoolBookingModel({
      ride: rideId,
      passenger: passengerId,
    });
    return booking.save();
  }

  async findBooking(rideId, passengerId) {
    return CarpoolBookingModel.findOne({ ride: rideId, passenger: passengerId }).exec();
  }

  async listForRide(rideId) {
    return CarpoolBookingModel.find({ ride: rideId })
      .populate('passenger', 'firstName lastName')
      .exec();
  }

  async delete(bookingId) {
    return CarpoolBookingModel.findByIdAndDelete(bookingId).exec();
  }

  async findById(id) {
    return CarpoolBookingModel.findById(id).exec();
  }

  async countByRide(rideId) {
    return CarpoolBookingModel.countDocuments({ ride: rideId }).exec();
  }
}

module.exports = new CarpoolBookingRepository();
