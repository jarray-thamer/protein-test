const mongoose = require("mongoose");
const { Schema } = mongoose;

const PromoCodeSchema = new Schema(
  {
    code: { type: String, unique: true },
    discount: { type: Number },
    startDate: { type: Date, default: new Date() },
    endDate: { type: Date },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PromoCode =
  mongoose.models.PromoCode || mongoose.model("PromoCode", PromoCodeSchema);

module.exports = PromoCode;
