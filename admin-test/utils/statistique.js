const mongoose = require("mongoose");
const Vente = require("../models/Ventes.js");

/**
 * Get total revenue over time with different time period options
 * @param {String} timeFrame - 'daily', 'weekly', 'monthly', 'quarterly', or 'yearly'
 * @param {Date} startDate - Start date for the analysis
 * @param {Date} endDate - End date for the analysis
 * @returns {Array} - Array of objects containing date and total revenue
 */
async function getTotalRevenueOverTime(
  timeFrame = "monthly",
  startDate = null,
  endDate = null
) {
  // Set default date range if not provided
  const end = endDate || new Date();
  // Default to 12 months ago if no start date
  const start =
    startDate || new Date(new Date().setFullYear(end.getFullYear() - 1));

  // Create the appropriate date grouping based on timeFrame
  let dateGrouping = {};

  if (timeFrame === "daily") {
    dateGrouping = {
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" },
      day: { $dayOfMonth: "$createdAt" },
    };
  } else if (timeFrame === "weekly") {
    dateGrouping = {
      year: { $year: "$createdAt" },
      week: { $week: "$createdAt" },
    };
  } else if (timeFrame === "monthly") {
    dateGrouping = {
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" },
    };
  } else if (timeFrame === "quarterly") {
    dateGrouping = {
      year: { $year: "$createdAt" },
      quarter: {
        $ceil: { $divide: [{ $month: "$createdAt" }, 3] },
      },
    };
  } else if (timeFrame === "yearly") {
    dateGrouping = {
      year: { $year: "$createdAt" },
    };
  }

  try {
    const revenueData = await Vente.aggregate([
      // Filter by date range
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          // Only consider completed orders for accurate revenue reporting
          // You may want to adjust this based on your business logic
          status: { $nin: ["cancelled", "refunded"] },
        },
      },
      // Group by the selected time frame
      {
        $group: {
          _id: dateGrouping,
          totalRevenue: { $sum: "$netAPayer" },
          count: { $sum: 1 },
        },
      },
      // Format the output
      {
        $project: {
          _id: 0,
          timePeriod: "$_id",
          totalRevenue: 1,
          count: 1,
        },
      },
      // Sort by date
      {
        $sort: {
          "timePeriod.year": 1,
          "timePeriod.month": 1,
          "timePeriod.day": 1,
          "timePeriod.week": 1,
          "timePeriod.quarter": 1,
        },
      },
    ]);

    // Format the results to be more user-friendly
    const formattedResults = revenueData.map((item) => {
      let date;
      let label;

      if (timeFrame === "daily") {
        date = new Date(
          item.timePeriod.year,
          item.timePeriod.month - 1,
          item.timePeriod.day
        );
        label = date.toLocaleDateString();
      } else if (timeFrame === "weekly") {
        // Create date for the first day of the week
        // Note: This assumes week starts on Sunday (0), adjust if needed
        date = new Date(item.timePeriod.year, 0, 1);
        date.setDate(date.getDate() + (item.timePeriod.week - 1) * 7);
        label = `Week ${item.timePeriod.week}, ${item.timePeriod.year}`;
      } else if (timeFrame === "monthly") {
        date = new Date(item.timePeriod.year, item.timePeriod.month - 1);
        label = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        });
      } else if (timeFrame === "quarterly") {
        date = new Date(
          item.timePeriod.year,
          (item.timePeriod.quarter - 1) * 3
        );
        label = `Q${item.timePeriod.quarter} ${item.timePeriod.year}`;
      } else if (timeFrame === "yearly") {
        date = new Date(item.timePeriod.year, 0);
        label = item.timePeriod.year.toString();
      }

      return {
        date,
        label,
        totalRevenue: item.totalRevenue,
        orderCount: item.count,
      };
    });

    return formattedResults;
  } catch (error) {
    console.error("Error fetching revenue statistics:", error);
    throw error;
  }
}

/**
 * Get year-over-year comparison for revenue
 * @returns {Object} Object containing current year and previous year data
 */
async function getYearOverYearComparison() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const lastYear = currentYear - 1;

  try {
    const yearlyData = await Vente.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${lastYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
          status: { $nin: ["cancelled", "refunded"] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$netAPayer" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    // Organize data by year and month
    const currentYearData = new Array(12).fill(0);
    const previousYearData = new Array(12).fill(0);

    yearlyData.forEach((item) => {
      if (item._id.year === currentYear) {
        currentYearData[item._id.month - 1] = item.totalRevenue;
      } else if (item._id.year === lastYear) {
        previousYearData[item._id.month - 1] = item.totalRevenue;
      }
    });

    // Calculate totals and growth
    const currentYearTotal = currentYearData.reduce((a, b) => a + b, 0);
    const previousYearTotal = previousYearData.reduce((a, b) => a + b, 0);

    const yearlyGrowth =
      previousYearTotal > 0
        ? ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100
        : 0;

    return {
      currentYear: {
        year: currentYear,
        monthlyRevenue: currentYearData,
        total: currentYearTotal,
      },
      previousYear: {
        year: lastYear,
        monthlyRevenue: previousYearData,
        total: previousYearTotal,
      },
      yearOverYearGrowth: yearlyGrowth,
    };
  } catch (error) {
    console.error("Error fetching year-over-year comparison:", error);
    throw error;
  }
}

async function getCategoryPerformance(startDate = null, endDate = null) {
  try {
    const matchStage = {
      createdAt: {
        $gte:
          startDate ||
          new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        $lte: endDate || new Date(),
      },
      status: { $nin: ["cancelled", "refunded"] },
      "items.type": "Product",
    };

    const categoryStats = await Vente.aggregate([
      { $match: matchStage },
      { $unwind: "$items" },
      { $match: { "items.type": "Product" } },
      {
        $lookup: {
          from: "products",
          localField: "items.itemId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category._id",
          categoryName: { $first: "$category.designation" },
          totalRevenue: { $sum: "$items.price" },
          totalSold: { $sum: "$items.quantity" },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: "$items.price" },
        },
      },
      {
        $project: {
          _id: 0,
          categoryId: "$_id",
          categoryName: 1,
          totalRevenue: 1,
          totalSold: 1,
          totalOrders: 1,
          averageOrderValue: 1,
          marketShare: {
            $divide: ["$totalRevenue", { $sum: "$totalRevenue" }],
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    return categoryStats;
  } catch (error) {
    console.error("Error fetching category performance:", error);
    throw error;
  }
}

async function getPromoCodeUsageStats(startDate = null, endDate = null) {
  try {
    const matchStage = {
      "promoCode.id": { $exists: true, $ne: null },
      createdAt: {
        $gte:
          startDate ||
          new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        $lte: endDate || new Date(),
      },
    };

    const stats = await Vente.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "promocodes", // Ensure this matches your collection name
          localField: "promoCode.id",
          foreignField: "_id",
          as: "promoCodeDetails",
        },
      },
      { $unwind: "$promoCodeDetails" },
      {
        $group: {
          _id: "$promoCodeDetails._id",
          code: { $first: "$promoCodeDetails.code" },
          discountValue: { $first: "$promoCodeDetails.discount" },
          totalUses: { $sum: 1 },
          totalDiscount: { $sum: "$discount" },
          totalRevenue: { $sum: "$netAPayer" },
          firstUsed: { $min: "$createdAt" },
          lastUsed: { $max: "$createdAt" },
        },
      },
      {
        $project: {
          _id: 0,
          promoCodeId: "$_id",
          code: 1,
          discountValue: 1,
          totalUses: 1,
          totalDiscount: 1,
          totalRevenue: 1,
          avgDiscountPerUse: {
            $cond: [
              { $eq: ["$totalUses", 0] },
              0,
              { $divide: ["$totalDiscount", "$totalUses"] },
            ],
          },
          firstUsed: 1,
          lastUsed: 1,
        },
      },
      { $sort: { totalUses: -1 } },
    ]);

    return stats;
  } catch (error) {
    console.error("Error fetching promo code stats:", error);
    throw error;
  }
}

module.exports = {
  getTotalRevenueOverTime,
  getYearOverYearComparison,
  getCategoryPerformance,
  getPromoCodeUsageStats,
};
