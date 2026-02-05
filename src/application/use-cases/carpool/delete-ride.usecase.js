const carpoolRideRepository = require('../../../infrastructure/mongoose/repositories/carpool-ride.repository');

async function deleteRide(rideId, currentUserId) {
  const ride = await carpoolRideRepository.findById(rideId);
  if (!ride) {
    const error = new Error('Ride not found');
    error.status = 404;
    throw error;
  }

  if (ride.driver.toString() !== currentUserId) {
    const error = new Error('Forbidden: only the driver can delete this ride');
    error.status = 403;
    throw error;
  }

  await carpoolRideRepository.delete(rideId);
  return { deleted: true };
}

module.exports = {
  deleteRide,
};
