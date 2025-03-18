const mongoose = require("mongoose");
const { Schema } = mongoose;

const VenteSchema = new Schema(
  {
    reference: { type: String },
    client: {
      id: { type: Schema.Types.ObjectId, ref: "Client" },
      name: { type: String },
      phone: { type: String },
      email: { type: String },
      address: { type: String },
      ville: { type: String },
      clientNote: { type: String },
      phone1: { type: String },
      phone2: { type: String },
    },
    livreur: {
      name: { type: String },
      cin: { type: String },
      carNumber: { type: String },
    },
    items: [
      {
        type: {
          type: String,
          enum: ["Product", "Pack"],
        },
        itemId: {
          type: Schema.Types.ObjectId,
          refPath: "items.type",
        },
        designation: String,
        quantity: Number,
        price: Number,
        oldPrice: Number,
        variant: String,
      },
    ],
    tva: { type: Number },
    discount: { type: Number },
    totalHT: { type: Number },
    totalTTC: { type: Number },
    livraison: { type: Number },
    netAPayer: { type: Number },
    modePayment: { type: String },
    note: { type: String },
    promoCode: {
      id: { type: Schema.Types.ObjectId, ref: "PromoCode" },
      code: { type: String },
      value: { type: Number },
    },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Ventes = mongoose.models.Vente || mongoose.model("Vente", VenteSchema);

module.exports = Ventes;
