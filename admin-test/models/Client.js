const mongoose = require("mongoose");
const { Schema } = mongoose;

const ClientSchema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    phone1: { type: String },
    phone2: { type: String },
    ville: { type: String },
    address: { type: String },
    subscriber: { type: Boolean, default: false },
    ordersId: [{ type: Schema.Types.ObjectId, ref: "Vente" }],
    cart: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
        gout: { type: String },
      },
    ],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    isGuest: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", ClientSchema);
