const { default: mongoose } = require("mongoose");
const PromoCode = require("../models/PromoCode");

const getPromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.find({}).sort("-createdAt");
    return res.status(200).json({ message: "successful", data: promoCode });
  } catch (error) {}
};

const createPromoCode = async (req, res) => {
  try {
    const { code } = req.body;
    const promoCode = await PromoCode.findOne({ code });

    if (promoCode) {
      return res.status(400).json({ message: "Promo code already exists" });
    }
    const data = await PromoCode.create(req.body);
    res.status(201).json({ message: "Success", data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updatePromoCode = async (req, res) => {
  try {
    const { id: _id } = req.params;
    //  check if the code is already existing
    const promoCode = await PromoCode.findById(_id);
    if (!promoCode) {
      return res.status(404).json({ message: "Promo code not found" });
    }
    const updatedPromoCode = await PromoCode.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Success", data: updatedPromoCode });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getPromoCodeById = async (req, res) => {
  try {
    const { id } = req.params;

    const promoCode = await PromoCode.findById(id);
    if (!promoCode) {
      return res.status(404).json({ message: "Promo code not found" });
    }
    res.status(200).json({ message: "Success", data: promoCode });
  } catch (error) {
    res.status(500).json({
      message: "error getting promo code by id, internal server error",
    });
  }
};

const deletePromoCode = async (req, res) => {
  try {
    const ids = req.body;

    // Validate input
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Please provide a non-empty array of promo code IDs",
      });
    }

    // Validate MongoDB IDs
    const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        message: "Invalid promo code ID format",
        invalidIds,
      });
    }

    // Delete operation
    const deleteResult = await PromoCode.deleteMany({
      _id: { $in: ids },
    });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({
        message: "No matching promo codes found to delete",
      });
    }

    return res.status(200).json({
      message: "Bulk delete operation completed",
      data: {
        deletedCount: deleteResult.deletedCount,
      },
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    return res.status(500).json({
      message: "Bulk delete operation failed",
      error: error.message,
    });
  }
};
module.exports = {
  getPromoCode,
  createPromoCode,
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode,
};
