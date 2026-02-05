const CarpoolRideModel = require('../models/carpool-ride.model');

class CarpoolRideRepository {
  async create({ eventId, driverId, departurePlace, departureTime, price, currency, seatsAvailable, maxDetourMinutes }) {
    const ride = new CarpoolRideModel({
      event: eventId,
      driver: driverId,
      departurePlace,
      departureTime,
      price,
      currency: currency || 'EUR',
      seatsAvailable,
      maxDetourMinutes,
    });
    return ride.save();
  }

  async findById(id) {
    return CarpoolRideModel.findById(id).exec();
  }

  async listForEvent(eventId) {
    return CarpoolRideModel.find({ event: eventId })
      .populate('driver', 'firstName lastName')
      .sort({ departureTime: 1 })
      .exec();
  }

  async delete(id) {
    return CarpoolRideModel.findByIdAndDelete(id).exec();
  }
}

module.exports = new CarpoolRideRepository();
