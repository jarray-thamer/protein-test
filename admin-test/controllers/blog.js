const mongoose = require("mongoose");
const cloudinary = require("../utils/cloudinary");
const Blog = require("../models/blog");

// Get all blog posts
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .sort("-createdAt")
      .select("title cover.url createdAt updatedAt content slug")
      .exec();
    return res
      .status(200)
      .json({ message: "Blogs fetched successfully", data: blogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new blog post
const createBlog = async (req, res) => {
  try {
    // Check for required fields (title and content) since they are essential for a blog post
    if (!req.body.title || !req.body.content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    let cover = undefined;
    if (req.file) {
      // Convert file buffer to data URI for Cloudinary upload
      const fileStr = req.file.buffer.toString("base64");
      const fileType = req.file.mimetype;
      const dataUri = `data:${fileType};base64,${fileStr}`;

      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "blogs",
        resource_type: "auto",
        transformation: [{ width: 1000, crop: "limit" }, { quality: "auto" }],
      });
      cover = { url: result.secure_url, img_id: result.public_id };
    }

    // Create new blog instance
    const newBlog = new Blog({
      title: req.body.title,
      content: req.body.content,
      cover: cover,
      status: req.body.status, // Will use schema default (true) if not provided
      inLandingPage: req.body.inLandingPage, // Will use schema default (false) if not provided
    });

    await newBlog.save();
    return res.status(201).json({
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: error.message || "Error creating blog",
    });
  }
};

// Delete a blog post
const deleteBlog = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const blog = await Blog.findById(_id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete cover image from Cloudinary if it exists
    if (blog.cover && blog.cover.img_id) {
      await cloudinary.uploader.destroy(blog.cover.img_id);
    }

    // Delete the blog post
    await Blog.findByIdAndDelete(_id);
    return res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting blog",
      error: error.message,
    });
  }
};

// Update a blog post
const updateBlog = async (req, res) => {
  try {
    const { id: _id } = req.params;

    // Validate allowed fields for update
    const allowedFields = ["title", "content", "status", "inLandingPage"];
    const updateFields = Object.keys(req.body);
    const invalidFields = updateFields.filter(
      (field) => !allowedFields.includes(field)
    );
    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Invalid fields provided: ${invalidFields.join(", ")}`,
      });
    }

    let cover = undefined;
    const blog = await Blog.findById(_id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (req.file) {
      // Delete old image if it exists
      if (blog.cover && blog.cover.img_id) {
        await cloudinary.uploader.destroy(blog.cover.img_id);
      }

      // Upload new image to Cloudinary
      const fileStr = req.file.buffer.toString("base64");
      const fileType = req.file.mimetype;
      const dataUri = `data:${fileType};base64,${fileStr}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "blogs",
        resource_type: "auto",
        transformation: [{ width: 1000, crop: "limit" }, { quality: "auto" }],
      });
      cover = { url: result.secure_url, img_id: result.public_id };
    }

    // Update the blog post
    const updatedBlog = await Blog.findByIdAndUpdate(
      _id,
      {
        ...req.body,
        ...(cover && { cover }),
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a blog post by ID
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(id).select("-_id -cover.img_id");
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({
      message: "Blog fetched successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get a blog by slug
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug }).select("-_id -cover.img_id");
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json({
      message: "Blog fetched successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get blogs where inLandingPage is true
const getLandingPageBlogs = async (req, res) => {
  try {
    // Fetch blogs with inLandingPage set to true, sorted by createdAt (newest first)
    const blogs = await Blog.find({ inLandingPage: true })
      .sort({ createdAt: -1 })
      .select("title cover.url createdAt slug updatedAt -_id")
      .exec();

    // Return success response with the blogs
    return res.status(200).json({
      message: "Landing page blogs retrieved successfully",
      data: blogs,
    });
  } catch (error) {
    // Return error response if something goes wrong
    return res.status(500).json({
      message: "Failed to retrieve landing page blogs",
      error: error.message,
    });
  }
};

// Export all controller functions
module.exports = {
  getAllBlogs,
  createBlog,
  deleteBlog,
  updateBlog,
  getBlogById,
  getLandingPageBlogs,
  getBlogBySlug,
};
