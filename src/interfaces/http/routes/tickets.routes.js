const express = require('express');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const { validate } = require('../../../validation/middlewares/validate.middleware');
const {
  createTicketTypeSchema,
  purchaseTicketSchema,
} = require('../../../validation/schemas/ticket.validation');
const { createTicketType } = require('../../../application/use-cases/ticketing/create-ticket-type.usecase');
const { purchaseTicket } = require('../../../application/use-cases/ticketing/purchase-ticket.usecase');
const ticketTypeRepository = require('../../../infrastructure/mongoose/repositories/ticket-type.repository');
const ticketRepository = require('../../../infrastructure/mongoose/repositories/ticket.repository');
const { requireEventOrganizer } = require('../../../middlewares/authorization.middleware');

const router = express.Router();

// Créer un type de billet pour un événement (organisateur)
router.post(
  '/events/:eventId/ticket-types',
  authMiddleware,
  requireEventOrganizer,
  validate(createTicketTypeSchema),
  async (req, res, next) => {
    try {
      const ticketType = await createTicketType(
        {
          eventId: req.params.eventId,
          name: req.body.name,
          price: req.body.price,
          currency: req.body.currency,
          quantity: req.body.quantity,
        },
        req.user.id
      );
      res.status(201).json(ticketType);
    } catch (err) {
      next(err);
    }
  }
);

// Lister les types de billets d'un événement
router.get('/events/:eventId/ticket-types', async (req, res, next) => {
  try {
    const ticketTypes = await ticketTypeRepository.listForEvent(req.params.eventId);
    res.json(ticketTypes);
  } catch (err) {
    next(err);
  }
});

// Acheter un billet pour un événement public (ouvert au public, sans auth obligatoire)
router.post(
  '/events/:eventId/tickets/purchase',
  validate(purchaseTicketSchema),
  async (req, res, next) => {
    try {
      const ticket = await purchaseTicket({
        ticketTypeId: req.body.ticketTypeId,
        buyerEmail: req.body.buyerEmail,
        buyerFirstName: req.body.buyerFirstName,
        buyerLastName: req.body.buyerLastName,
        buyerAddress: req.body.buyerAddress,
      });
      res.status(201).json(ticket);
    } catch (err) {
      next(err);
    }
  }
);

// Lister les billets vendus d'un événement (organisateurs uniquement)
router.get(
  '/events/:eventId/tickets',
  authMiddleware,
  requireEventOrganizer,
  async (req, res, next) => {
    try {
      const tickets = await ticketRepository.listForEvent(req.params.eventId);
      res.json(tickets);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

