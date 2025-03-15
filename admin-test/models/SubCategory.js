const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubCategorySchema = new Schema({
  designation: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

module.exports = SubCategory;
