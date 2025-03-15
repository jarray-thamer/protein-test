const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const mongoose = require("mongoose");

const createSubCategory = async (req, res) => {
  try {
    const { designation, categoryId } = req.body;

    // Validate that the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create the sub-category
      const newSubCategory = await SubCategory.create(
        [
          {
            designation,
            category: categoryId,
            products: [],
          },
        ],
        { session }
      );

      // Update the category to include this sub-category
      await Category.findByIdAndUpdate(
        categoryId,
        {
          $push: { subCategories: newSubCategory[0]._id },
          updatedAt: Date.now(),
        },
        { session }
      );

      await session.commitTransaction();

      return res.status(201).json({
        message: "Sub-category created successfully",
        data: newSubCategory[0],
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error creating sub-category",
      error: error.message,
    });
  }
};

// Delete Subcategory
const deleteSubCategory = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { id: _id } = req.params;
    session.startTransaction();

    const subCategory = await SubCategory.findById(_id).session(session);
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    if (subCategory.products.length > 0) {
      await Product.updateMany(
        { subCategory: _id },
        { $pull: { subCategory: _id } },
        { session }
      );
    }
    if (subCategory.category) {
      await Category.findByIdAndUpdate(
        subCategory.category,
        { $pull: { subCategories: _id } },
        { session }
      );
    }
    await SubCategory.findByIdAndDelete(_id, { session });

    await session.commitTransaction();

    return res.status(200).json({
      message: "Subcategory deleted successfully",
      data: subCategory,
    });
  } catch (error) {
    if (session) await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    if (session) session.endSession();
  }
};

// Update Subcategory
const updateSubCategory = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { id: _id } = req.params;
    const { designation } = req.body;

    session.startTransaction();

    const subCategory = await SubCategory.findById(_id).session(session);
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    subCategory.designation = designation;
    subCategory.updatedAt = Date.now();

    await subCategory.save({ session });

    await session.commitTransaction();

    return res.status(200).json({
      message: "Subcategory updated successfully",
      data: subCategory,
    });
  } catch (error) {
    if (session) await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    if (session) session.endSession();
  }
};

// Get Subcategories by Category
const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const subCategories = await SubCategory.find({ category: categoryId })
      .populate("category", "designation")
      .sort("-createdAt")
      .exec();

    if (!subCategories || subCategories.length === 0) {
      return res
        .status(404)
        .json({ message: "No subcategories found for this category" });
    }

    return res.status(200).json({
      message: "Subcategories fetched successfully",
      data: subCategories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Subcategories
const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({})
      .populate("category", "designation")
      .sort("-createdAt")
      .exec();

    return res.status(200).json({
      message: "All subcategories fetched successfully",
      data: subCategories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
  getSubCategoriesByCategory,
  getAllSubCategories,
};
