const mongoose = require("mongoose");
const { handleSlug } = require("../utils/slugGenerator");
const { Schema } = mongoose;

const PagesSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String },
    cover: { url: { type: String }, img_id: { type: String } },
    content: { type: String },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PagesSchema.pre("save", async function (next) {
  try {
    this.slug = await handleSlug(this, "title", this.constructor);
    next();
  } catch (error) {
    next(error);
  }
});

const Page = mongoose.models.Page || mongoose.model("Page", PagesSchema);

module.exports = Page;
