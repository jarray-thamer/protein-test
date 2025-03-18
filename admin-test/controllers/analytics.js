const mongoose = require("mongoose");
const {
  getTotalRevenueOverTime,
  getYearOverYearComparison,
  getCategoryPerformance,
  getPromoCodeUsageStats,
} = require("../utils/statistique");
const Ventes = require("../models/Vente");

const getTopSellingProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const topProducts = await Ventes.aggregate([
      { $unwind: "$items" },
      { $match: { "items.type": "Product" } },
      {
        $group: {
          _id: "$items.itemId",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
          designation: { $first: "$items.designation" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 1,
          designation: 1,
          totalSold: 1,
          totalRevenue: 1,
          image: "$productDetails.mainImage.url",
          category: "$productDetails.category",
          inStock: "$productDetails.inStock",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: topProducts.length,
      data: topProducts,
    });
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching top products",
      error: error.message,
    });
  }
};

const getTotalRevenueOverTimeController = async (req, res) => {
  try {
    const { timeFrame, startDate, endDate } = req.query;

    // Convert string dates to Date objects if provided
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const revenueData = await getTotalRevenueOverTime(timeFrame, start, end);

    res.status(200).json({
      success: true,
      data: revenueData,
    });
  } catch (error) {
    console.error("Error in revenue statistics route:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve revenue statistics",
      error: error.message,
    });
  }
};
const getYearOverYearComparisonController = async (req, res) => {
  try {
    const comparisonData = await getYearOverYearComparison();

    res.status(200).json({
      success: true,
      data: comparisonData,
    });
  } catch (error) {
    console.error("Error in year comparison route:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve year-over-year comparison",
      error: error.message,
    });
  }
};

const getCategoryPerformanceController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const categoryData = await getCategoryPerformance(start, end);

    res.status(200).json({
      success: true,
      data: categoryData,
    });
  } catch (error) {
    console.error("Error in category performance route:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve category performance",
      error: error.message,
    });
  }
};

const getPromoCodeUsageController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const promoStats = await getPromoCodeUsageStats(start, end);

    res.status(200).json({
      success: true,
      data: promoStats,
    });
  } catch (error) {
    console.error("Error in promo code stats route:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve promo code statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getTopSellingProducts,
  getYearOverYearComparisonController,
  getTotalRevenueOverTimeController,
  getCategoryPerformanceController,
  getPromoCodeUsageController,
};
