const carpoolRideRepository = require('../../../infrastructure/mongoose/repositories/carpool-ride.repository');
const carpoolBookingRepository = require('../../../infrastructure/mongoose/repositories/carpool-booking.repository');
const eventParticipantRepository = require('../../../infrastructure/mongoose/repositories/event-participant.repository');

async function bookRide(rideId, currentUserId) {
  const ride = await carpoolRideRepository.findById(rideId);
  if (!ride) {
    const error = new Error('Ride not found');
    error.status = 404;
    throw error;
  }

  const isParticipant = await eventParticipantRepository.findParticipant(ride.event, currentUserId);
  if (!isParticipant) {
    const error = new Error('Only event participants can book a ride');
    error.status = 403;
    throw error;
  }

  if (ride.driver.toString() === currentUserId) {
    const error = new Error('Driver cannot book their own ride');
    error.status = 400;
    throw error;
  }

  const existing = await carpoolBookingRepository.findBooking(rideId, currentUserId);
  if (existing) {
    const error = new Error('Already booked on this ride');
    error.status = 409;
    throw error;
  }

  const bookingsCount = await carpoolBookingRepository.countByRide(rideId);
  if (bookingsCount >= ride.seatsAvailable) {
    const error = new Error('No more seats available');
    error.status = 409;
    throw error;
  }

  const booking = await carpoolBookingRepository.create({
    rideId,
    passengerId: currentUserId,
  });

  return booking;
}

module.exports = {
  bookRide,
};
