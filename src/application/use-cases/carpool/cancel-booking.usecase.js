const carpoolBookingRepository = require('../../../infrastructure/mongoose/repositories/carpool-booking.repository');
const carpoolRideRepository = require('../../../infrastructure/mongoose/repositories/carpool-ride.repository');

async function cancelBooking(bookingId, currentUserId) {
  const booking = await carpoolBookingRepository.findById(bookingId);
  if (!booking) {
    const error = new Error('Booking not found');
    error.status = 404;
    throw error;
  }

  const ride = await carpoolRideRepository.findById(booking.ride);
  const isDriver = ride.driver.toString() === currentUserId;
  const isPassenger = booking.passenger.toString() === currentUserId;

  if (!isDriver && !isPassenger) {
    const error = new Error('Forbidden: only driver or passenger can cancel this booking');
    error.status = 403;
    throw error;
  }

  await carpoolBookingRepository.delete(bookingId);
  return { deleted: true };
}

module.exports = {
  cancelBooking,
};
