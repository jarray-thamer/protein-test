const express = require("express");
const {
  getAllBlogs,
  getLandingPageBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
  getBlogBySlug,
} = require("../controllers/blog");
const { upload } = require("../middleware/multer");

const BlogRoute = express.Router();

BlogRoute.get("/get/all", getAllBlogs);
BlogRoute.post("/new", upload.single("cover"), createBlog);
BlogRoute.put("/update/:id", upload.single("cover"), updateBlog);
BlogRoute.delete("/delete/:id", deleteBlog);
BlogRoute.get("/get-all-landing-page", getLandingPageBlogs);
BlogRoute.get("/get/:id", getBlogById);
BlogRoute.get("/get/by-slug/:slug", getBlogBySlug);

module.exports = BlogRoute;
