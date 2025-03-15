const mongoose = require("mongoose");
const { Schema } = mongoose;
const { handleSlug } = require("../utils/slugGenerator");

const PackSchema = new Schema(
  {
    designation: { type: String, required: true },
    slug: { type: String, unique: true },
    price: { type: Number, required: true },
    smallDescription: { type: String },
    description: { type: String },
    question: { type: String },
    oldPrice: { type: Number },
    mainImage: {
      url: { type: String },
      img_id: { type: String },
    },
    images: [{ url: { type: String }, img_id: { type: String } }],
    products: [{ type: String }],
    status: { type: Boolean, default: true },
    features: [{ type: String }],
    venteflashDate: { type: Date },
    inStock: { type: Boolean, default: true },
    rate: { type: Number },
    reviews: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "Client" },
        userName: { type: String },
        rating: { type: Number },
        comment: { type: String },
        isAnonymous: { type: Boolean },
        createdAt: { type: Date, default: Date.now() },
        updatedAt: { type: Date, default: Date.now() },
      },
    ],
  },
  { timestamps: true }
);

// Pre-save middleware to handle slug generation
PackSchema.pre("save", async function (next) {
  try {
    this.slug = await handleSlug(this, "designation", this.constructor);
    next();
  } catch (error) {
    next(error);
  }
});

// Check if model already exists before creating
const Pack = mongoose.models.Pack || mongoose.model("Pack", PackSchema);

module.exports = Pack;
