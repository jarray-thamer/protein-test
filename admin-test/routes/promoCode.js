const { Router } = require("express");
const {
  getPromoCode,
  createPromoCode,
  updatePromoCode,
  getPromoCodeById,
  deletePromoCode,
} = require("../controllers/promoCode");
const { validatePromoCode } = require("../controllers/vente");

const AdminPromoCodeRouter = Router();

AdminPromoCodeRouter.get("/get/all", getPromoCode);
AdminPromoCodeRouter.get("/get/:id", getPromoCodeById);
AdminPromoCodeRouter.post("/new", createPromoCode);
AdminPromoCodeRouter.put("/update/:id", updatePromoCode);
AdminPromoCodeRouter.post("/delete/many", deletePromoCode);
AdminPromoCodeRouter.get("/validate/:code", validatePromoCode);

module.exports = AdminPromoCodeRouter;
