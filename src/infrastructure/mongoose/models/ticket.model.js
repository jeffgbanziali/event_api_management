const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    ticketType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TicketType',
      required: true,
      index: true,
    },
    buyerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    buyerFirstName: {
      type: String,
      required: true,
    },
    buyerLastName: {
      type: String,
      required: true,
    },
    buyerAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
    },
    purchaseDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Une personne (email) ne peut avoir qu'un seul billet par événement
ticketSchema.index({ event: 1, buyerEmail: 1 }, { unique: true });

const TicketModel = mongoose.model('Ticket', ticketSchema);

module.exports = TicketModel;

