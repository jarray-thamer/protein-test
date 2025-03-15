const Category = require("../models/Category");
const mongoose = require("mongoose");
const SubCategory = require("../models/SubCategory");
const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find({})
      .sort("-createdAt")
      .populate("subCategories", "designation")
      .exec();
    return res
      .status(200)
      .json({ message: "Categories fetched successfully", data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Create data URI from buffer
    const fileStr = req.file.buffer.toString("base64");
    const fileType = req.file.mimetype;
    const dataUri = `data:${fileType};base64,${fileStr}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "categories",
      resource_type: "auto",
      transformation: [
        { width: 1000, crop: "limit" }, // Resize if larger than 1000px
        { quality: "auto" }, // Automatic quality optimization
      ],
    });

    const newCategory = new Category({
      designation: req.body.designation,
      image: { url: result.secure_url, img_id: result.public_id },
    });

    await newCategory.save();

    return res.status(201).json({
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: error.message || "Error uploading image",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id: _id } = req.params;

    // First check if category exists
    const category = await Category.findById(_id)
      .populate("products")
      .populate("subCategories");

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update all products to remove category and subCategory references
      if (category.products.length > 0) {
        await Product.updateMany(
          { category: _id },
          {
            $unset: {
              category: "",
              subCategory: "",
            },
          },
          { session }
        );
      }

      // Delete all subcategories
      if (category.subCategories.length > 0) {
        // Update products in subcategories to remove subCategory reference
        await Product.updateMany(
          { subCategory: { $in: category.subCategories.map((sc) => sc._id) } },
          {
            $unset: { subCategory: "" },
          },
          { session }
        );

        // Delete subcategories
        await SubCategory.deleteMany(
          {
            _id: { $in: category.subCategories.map((sc) => sc._id) },
          },
          { session }
        );
      }

      // Delete category image if exists
      if (category.image) {
        await cloudinary.uploader.destroy(category.image.img_id);
      }

      // Finally delete the category
      await Category.findByIdAndDelete(_id, { session });

      // Commit the transaction
      await session.commitTransaction();

      return res.status(200).json({
        message:
          "Category deleted successfully. Products have been preserved with their category references removed.",
        data: {
          deletedCategory: category.designation,
          deletedSubCategories: category.subCategories.length,
          updatedProducts: category.products.length,
        },
      });
    } catch (error) {
      // If anything fails, abort the transaction
      await session.abortTransaction();
      throw error;
    } finally {
      // End the session
      session.endSession();
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting category",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id: _id } = req.params;

    // Validate that only allowed fields are being updated
    const allowedFields = ["designation", "image"];
    const updateFields = Object.keys(req.body);
    const invalidFields = updateFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Invalid fields provided: ${invalidFields.join(", ")}`,
      });
    }

    let result = null;

    const category = await Category.findById(_id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (req.file) {
      if (category.image) {
        await cloudinary.uploader.destroy(category.image.img_id);
      }
      const fileStr = req.file.buffer.toString("base64");
      const fileType = req.file.mimetype;
      const dataUri = `data:${fileType};base64,${fileStr}`;

      // Upload to Cloudinary
      result = await cloudinary.uploader.upload(dataUri, {
        folder: "categories",
        resource_type: "auto",
        transformation: [
          { width: 1000, crop: "limit" }, // Resize if larger than 1000px
          { quality: "auto" }, // Automatic quality optimization
        ],
      });
    }

    const data = {
      ...req.body,
      image: { url: result.secure_url, img_id: result.public_id },
    };
    // Find and update the category
    const newCategory = await Category.findByIdAndUpdate(_id, data, {
      new: true,
      runValidators: true,
    });

    // Handle image deletion if the image was updated

    return res.status(200).json({
      message: "Category updated successfully",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // Find the category by ID
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  getCategoryById,
};
