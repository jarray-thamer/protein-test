// routes/analyticsRoutes.js
const express = require("express");
const { getTopSellingProducts } = require("../controllers/analytics");

const Analytics = express.Router();

Analytics.get("/top-products", (req, res) => {
  res.send("Hello World");
});

module.exports = Analytics;
