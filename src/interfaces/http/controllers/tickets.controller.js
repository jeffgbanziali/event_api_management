const { validate } = require('../../../validation/middlewares/validate.middleware');
const {
  createTicketTypeSchema,
  updateTicketTypeSchema,
  purchaseTicketSchema,
} = require('../../../validation/schemas/ticket.validation');
const { createTicketType } = require('../../../application/use-cases/ticketing/create-ticket-type.usecase');
const { updateTicketType } = require('../../../application/use-cases/ticketing/update-ticket-type.usecase');
const { deleteTicketType } = require('../../../application/use-cases/ticketing/delete-ticket-type.usecase');
const { purchaseTicket } = require('../../../application/use-cases/ticketing/purchase-ticket.usecase');
const ticketTypeRepository = require('../../../infrastructure/mongoose/repositories/ticket-type.repository');
const ticketRepository = require('../../../infrastructure/mongoose/repositories/ticket.repository');

const validateCreateTicketType = validate(createTicketTypeSchema);
const validateUpdateTicketType = validate(updateTicketTypeSchema);
const validatePurchase = validate(purchaseTicketSchema);

async function createTicketTypeHandler(req, res, next) {
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

async function listTicketTypes(req, res, next) {
  try {
    const ticketTypes = await ticketTypeRepository.listForEvent(req.params.eventId);
    res.json(ticketTypes);
  } catch (err) {
    next(err);
  }
}

async function updateTicketTypeHandler(req, res, next) {
  try {
    const ticketType = await updateTicketType(
      req.params.ticketTypeId,
      req.body,
      req.params.eventId
    );
    res.json(ticketType);
  } catch (err) {
    next(err);
  }
}

async function deleteTicketTypeHandler(req, res, next) {
  try {
    await deleteTicketType(req.params.ticketTypeId, req.params.eventId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function purchase(req, res, next) {
  try {
    const ticket = await purchaseTicket(
      {
        ticketTypeId: req.body.ticketTypeId,
        buyerEmail: req.body.buyerEmail,
        buyerFirstName: req.body.buyerFirstName,
        buyerLastName: req.body.buyerLastName,
        buyerAddress: req.body.buyerAddress,
      },
      req.user?.id
    );
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
}

async function listTickets(req, res, next) {
  try {
    const tickets = await ticketRepository.listForEvent(req.params.eventId);
    res.json(tickets);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCreateTicketType,
  validateUpdateTicketType,
  validatePurchase,
  createTicketTypeHandler,
  listTicketTypes,
  updateTicketTypeHandler,
  deleteTicketTypeHandler,
  purchase,
  listTickets,
};
