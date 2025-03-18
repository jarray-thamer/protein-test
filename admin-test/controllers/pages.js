const mongoose = require("mongoose");
const cloudinary = require("../utils/cloudinary");
const Page = require("../models/Page");

// Get all pages
const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find({})
      .sort("-createdAt")
      .select("title cover.url createdAt updatedAt content slug status")
      .exec();
    return res.status(200).json({
      message: "Pages fetched successfully",
      data: pages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new page
const createPage = async (req, res) => {
  try {
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    let cover = undefined;
    if (req.file) {
      const fileStr = req.file.buffer.toString("base64");
      const fileType = req.file.mimetype;
      const dataUri = `data:${fileType};base64,${fileStr}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "pages",
        resource_type: "auto",
        transformation: [{ width: 1000, crop: "limit" }, { quality: "auto" }],
      });
      cover = { url: result.secure_url, img_id: result.public_id };
    }

    const newPage = new Page({
      title: req.body.title,
      content: req.body.content,
      cover: cover,
      status: req.body.status,
    });

    await newPage.save();
    return res.status(201).json({
      message: "Page created successfully",
      data: newPage,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: error.message || "Error creating page",
    });
  }
};

// Delete a page
const deletePage = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const page = await Page.findById(_id);

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    if (page.cover && page.cover.img_id) {
      await cloudinary.uploader.destroy(page.cover.img_id);
    }

    await Page.findByIdAndDelete(_id);
    return res.status(200).json({
      message: "Page deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting page",
      error: error.message,
    });
  }
};

// Update a page
const updatePage = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const allowedFields = ["title", "content", "status"];
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
    const page = await Page.findById(_id);

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    if (req.file) {
      if (page.cover && page.cover.img_id) {
        await cloudinary.uploader.destroy(page.cover.img_id);
      }

      const fileStr = req.file.buffer.toString("base64");
      const fileType = req.file.mimetype;
      const dataUri = `data:${fileType};base64,${fileStr}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "pages",
        resource_type: "auto",
        transformation: [{ width: 1000, crop: "limit" }, { quality: "auto" }],
      });
      cover = { url: result.secure_url, img_id: result.public_id };
    }

    const updatedPage = await Page.findByIdAndUpdate(
      _id,
      {
        ...req.body,
        ...(cover && { cover }),
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Page updated successfully",
      data: updatedPage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a page by ID
const getPageById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid page ID" });
    }

    const page = await Page.findById(id).select("-_id -cover.img_id");
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    return res.status(200).json({
      message: "Page fetched successfully",
      data: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a page by slug
const getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await Page.findOne({ slug }).select("-_id -cover.img_id");

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    return res.status(200).json({
      message: "Page fetched successfully",
      data: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPages,
  createPage,
  deletePage,
  updatePage,
  getPageById,
  getPageBySlug,
};
