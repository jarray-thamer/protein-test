const mongoose = require("mongoose");
const { handleSlug } = require("../utils/slugGenerator");
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    designation: { type: String, required: true },
    slug: { type: String },
    bestSellerSection: { type: Boolean, default: false },
    smallDescription: { type: String },
    description: { type: String },
    question: { type: String },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    mainImage: {
      url: { type: String, require: true },
      img_id: { type: String },
    },
    images: [{ url: { type: String }, img_id: { type: String } }],
    venteflashDate: { type: Date },
    inStock: { type: Boolean, default: true },
    status: { type: Boolean, default: true },
    features: [{ type: String }],
    variant: [
      {
        title: { type: String, required: true },
        inStock: { type: Boolean, default: true },
      },
    ],
    nutritionalValues: [
      {
        title: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    subCategory: [{ type: Schema.Types.ObjectId, ref: "SubCategory" }],
    brand: { type: String },
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
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);
// Pre-save middleware to handle slug generation
ProductSchema.pre("save", async function (next) {
  try {
    this.slug = await handleSlug(this, "designation", this.constructor);
    next();
  } catch (error) {
    next(error);
  }
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
