const { Router } = require("express");
const adminAuthRoutes = require("./auth");
const AdminProductRoutes = require("./product");
const AdminCategoryRoutes = require("./category");
const AdminSubCategoryRoutes = require("./subCategory");
const ClientRoutes = require("./client");
const VenteRoutes = require("./vente");
const AdminPackRouter = require("./pack");
const AdminPromoCodeRouter = require("./promoCode");
const AdminInformationRouter = require("./information");
const Analytics = require("./analytics");
const BlogRoute = require("./blog");
const messagesRoutes = require("./messages");
const PageRouter = require("./page");

const adminRouter = Router();

adminRouter.use("/auth", adminAuthRoutes);
adminRouter.use("/product", AdminProductRoutes);
adminRouter.use("/category", AdminCategoryRoutes);
adminRouter.use("/subcategory", AdminSubCategoryRoutes);
adminRouter.use("/clients", ClientRoutes);
adminRouter.use("/vente", VenteRoutes);
adminRouter.use("/pack", AdminPackRouter);
adminRouter.use("/promo-code", AdminPromoCodeRouter);
adminRouter.use("/settings", AdminInformationRouter);
adminRouter.use("/analytics", Analytics);
adminRouter.use("/blogs", BlogRoute);
adminRouter.use("/messages", messagesRoutes);
adminRouter.use("/pages", PageRouter);

module.exports = adminRouter;
