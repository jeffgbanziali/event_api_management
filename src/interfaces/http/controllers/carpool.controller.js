// Contrôleur covoiturage : créer un trajet, réserver une place, annuler, supprimer (participant / conducteur)
const { validate } = require('../../../validation/middlewares/validate.middleware');
const { createRideSchema } = require('../../../validation/schemas/carpool.validation');
const { createRide } = require('../../../application/use-cases/carpool/create-ride.usecase');
const { bookRide } = require('../../../application/use-cases/carpool/book-ride.usecase');
const { cancelBooking } = require('../../../application/use-cases/carpool/cancel-booking.usecase');
const { deleteRide } = require('../../../application/use-cases/carpool/delete-ride.usecase');
const carpoolRideRepository = require('../../../infrastructure/mongoose/repositories/carpool-ride.repository');
const carpoolBookingRepository = require('../../../infrastructure/mongoose/repositories/carpool-booking.repository');

const validateCreateRide = validate(createRideSchema);

async function addRide(req, res, next) {
  try {
    const ride = await createRide(
      {
        eventId: req.params.eventId,
        departurePlace: req.body.departurePlace,
        departureTime: req.body.departureTime,
        price: req.body.price,
        currency: req.body.currency,
        seatsAvailable: req.body.seatsAvailable,
        maxDetourMinutes: req.body.maxDetourMinutes,
      },
      req.user.id
    );
    res.status(201).json(ride);
  } catch (err) {
    next(err);
  }
}

async function listRides(req, res, next) {
  try {
    const rides = await carpoolRideRepository.listForEvent(req.params.eventId);
    res.json(rides);
  } catch (err) {
    next(err);
  }
}

async function deleteRideHandler(req, res, next) {
  try {
    await deleteRide(req.params.rideId, req.user.id);
    res.status(200).json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

async function bookRideHandler(req, res, next) {
  try {
    const booking = await bookRide(req.params.rideId, req.user.id);
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
}

async function listBookings(req, res, next) {
  try {
    const bookings = await carpoolBookingRepository.listForRide(req.params.rideId);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

async function cancelBookingHandler(req, res, next) {
  try {
    await cancelBooking(req.params.bookingId, req.user.id);
    res.status(200).json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCreateRide,
  addRide,
  listRides,
  deleteRideHandler,
  bookRideHandler,
  listBookings,
  cancelBookingHandler,
};
