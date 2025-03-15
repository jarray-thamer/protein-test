const mongoose = require("mongoose");
const { handleSlug } = require("../utils/slugGenerator");
const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    designation: {
      type: String,
      required: true,
    },
    slug: { type: String },

    image: {
      url: {
        type: String,
      },
      img_id: { type: String },
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    subCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    ],
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

CategorySchema.pre("save", async function (next) {
  try {
    this.slug = await handleSlug(this, "designation", this.constructor);
    next();
  } catch (error) {
    next(error);
  }
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
