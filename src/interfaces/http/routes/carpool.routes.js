// Routes covoiturage : trajets (participant), réservations, annulation (conducteur ou passager)
const express = require('express');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const { requireEventParticipant } = require('../../../middlewares/authorization.middleware');
const carpoolController = require('../controllers/carpool.controller');

const router = express.Router();

router.post(
  '/events/:eventId/rides',
  authMiddleware,
  requireEventParticipant,
  carpoolController.validateCreateRide,
  carpoolController.addRide
);

router.get(
  '/events/:eventId/rides',
  authMiddleware,
  requireEventParticipant,
  carpoolController.listRides
);

router.delete(
  '/rides/:rideId',
  authMiddleware,
  carpoolController.deleteRideHandler
);

router.post(
  '/rides/:rideId/bookings',
  authMiddleware,
  carpoolController.bookRideHandler
);

router.get(
  '/rides/:rideId/bookings',
  authMiddleware,
  carpoolController.listBookings
);

router.delete(
  '/bookings/:bookingId',
  authMiddleware,
  carpoolController.cancelBookingHandler
);

module.exports = router;
