const eventRepository = require('../../../infrastructure/mongoose/repositories/event.repository');
const carpoolRideRepository = require('../../../infrastructure/mongoose/repositories/carpool-ride.repository');

async function createRide(input, currentUserId) {
  const event = await eventRepository.findById(input.eventId);
  if (!event) {
    const error = new Error('Event not found');
    error.status = 404;
    throw error;
  }

  if (!event.settings?.carpoolingEnabled) {
    const error = new Error('Carpooling is not enabled for this event');
    error.status = 400;
    throw error;
  }

  const ride = await carpoolRideRepository.create({
    eventId: input.eventId,
    driverId: currentUserId,
    departurePlace: input.departurePlace,
    departureTime: input.departureTime,
    price: input.price,
    currency: input.currency,
    seatsAvailable: input.seatsAvailable,
    maxDetourMinutes: input.maxDetourMinutes,
  });

  return ride;
}

module.exports = {
  createRide,
};
