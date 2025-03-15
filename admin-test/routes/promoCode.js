const { Router } = require("express");
const {
  getPromoCode,
  createPromoCode,
  updatePromoCode,
  getPromoCodeById,
  deletePromoCode,
} = require("../controllers/promoCode");

const AdminPromoCodeRouter = Router();

AdminPromoCodeRouter.get("/get/all", getPromoCode);
AdminPromoCodeRouter.get("/get/:id", getPromoCodeById);
AdminPromoCodeRouter.post("/new", createPromoCode);
AdminPromoCodeRouter.put("/update/:id", updatePromoCode);
AdminPromoCodeRouter.post("/delete/many", deletePromoCode);

module.exports = AdminPromoCodeRouter;
