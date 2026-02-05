// Contrôleur liste de courses : ajout, liste, suppression d'items par événement (participant)
const { validate } = require('../../../validation/middlewares/validate.middleware');
const { createShoppingItemSchema } = require('../../../validation/schemas/shopping.validation');
const { addShoppingItem } = require('../../../application/use-cases/shopping/add-shopping-item.usecase');
const { listShoppingItems } = require('../../../application/use-cases/shopping/list-shopping-items.usecase');
const { removeShoppingItem } = require('../../../application/use-cases/shopping/remove-shopping-item.usecase');

const validateCreateItem = validate(createShoppingItemSchema);

async function addItem(req, res, next) {
  try {
    const item = await addShoppingItem(
      {
        eventId: req.params.eventId,
        name: req.body.name,
        quantity: req.body.quantity,
        arrivalTime: req.body.arrivalTime,
      },
      req.user.id
    );
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

async function listItems(req, res, next) {
  try {
    const items = await listShoppingItems(req.params.eventId);
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function deleteItem(req, res, next) {
  try {
    await removeShoppingItem(req.params.itemId, req.user.id);
    res.status(200).json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCreateItem,
  addItem,
  listItems,
  deleteItem,
};
