// routes/analyticsRoutes.js
const express = require("express");
const {
  getTopSellingProducts,
  getTotalRevenueOverTimeController,
  getYearOverYearComparisonController,
  getCategoryPerformanceController,
  getPromoCodeUsageController,
} = require("../controllers/analytics");

const Analytics = express.Router();

Analytics.get("/top-products", getTopSellingProducts);
Analytics.get("/revenue", getTotalRevenueOverTimeController);
Analytics.get("/revenue/year-comparison", getYearOverYearComparisonController);
Analytics.get("/category-performance", getCategoryPerformanceController);
Analytics.get("/promo-code-performance", getPromoCodeUsageController);
module.exports = Analytics;
