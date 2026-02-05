// Routes liste de courses : ajout / liste / suppression par événement (participant)
const express = require('express');
const { authMiddleware } = require('../../../middlewares/auth.middleware');
const { requireEventParticipant } = require('../../../middlewares/authorization.middleware');
const shoppingController = require('../controllers/shopping.controller');

const router = express.Router();

router.post(
  '/events/:eventId/shopping-items',
  authMiddleware,
  requireEventParticipant,
  shoppingController.validateCreateItem,
  shoppingController.addItem
);

router.get(
  '/events/:eventId/shopping-items',
  authMiddleware,
  requireEventParticipant,
  shoppingController.listItems
);

router.delete(
  '/shopping-items/:itemId',
  authMiddleware,
  shoppingController.deleteItem
);

module.exports = router;
