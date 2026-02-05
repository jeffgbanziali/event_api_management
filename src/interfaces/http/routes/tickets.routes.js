const express = require('express');
const { authMiddleware, optionalAuthMiddleware } = require('../../../middlewares/auth.middleware');
const { requireEventOrganizer } = require('../../../middlewares/authorization.middleware');
const ticketsController = require('../controllers/tickets.controller');

const router = express.Router();

router.post(
  '/events/:eventId/ticket-types',
  authMiddleware,
  requireEventOrganizer,
  ticketsController.validateCreateTicketType,
  ticketsController.createTicketTypeHandler
);
router.get('/events/:eventId/ticket-types', ticketsController.listTicketTypes);

router.patch(
  '/events/:eventId/ticket-types/:ticketTypeId',
  authMiddleware,
  requireEventOrganizer,
  ticketsController.validateUpdateTicketType,
  ticketsController.updateTicketTypeHandler
);
router.delete(
  '/events/:eventId/ticket-types/:ticketTypeId',
  authMiddleware,
  requireEventOrganizer,
  ticketsController.deleteTicketTypeHandler
);

router.post(
  '/events/:eventId/tickets/purchase',
  optionalAuthMiddleware,
  ticketsController.validatePurchase,
  ticketsController.purchase
);

router.get(
  '/events/:eventId/tickets',
  authMiddleware,
  requireEventOrganizer,
  ticketsController.listTickets
);

module.exports = router;
