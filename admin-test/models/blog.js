const mongoose = require("mongoose");
const { handleSlug } = require("../utils/slugGenerator");
const { Schema } = mongoose;

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String },
    cover: { url: { type: String }, img_id: { type: String } },
    content: { type: String },
    status: { type: Boolean, default: true },
    inLandingPage: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Pre-save middleware to handle slug generation
BlogSchema.pre("save", async function (next) {
  try {
    this.slug = await handleSlug(this, "title", this.constructor);
    next();
  } catch (error) {
    next(error);
  }
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

module.exports = Blog;
