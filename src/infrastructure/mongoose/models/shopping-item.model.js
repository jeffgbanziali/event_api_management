const mongoose = require('mongoose');

const shoppingItemSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Chaque chose apportée est unique par événement (même nom = même item)
shoppingItemSchema.index({ event: 1, name: 1 }, { unique: true });

const ShoppingItemModel = mongoose.model('ShoppingItem', shoppingItemSchema);

module.exports = ShoppingItemModel;
