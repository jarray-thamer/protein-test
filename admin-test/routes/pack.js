const { Router } = require("express");
const {
  createPack,
  getPacks,
  deletePack,
  getAllPacks,
  updatePack,
  deletePacksInBulk,
  getPackById,
  getPackList,
  getPackBySlug,
} = require("../controllers/pack");
const { uploadProductImages } = require("../middleware/multer");

const AdminPackRouter = Router();

AdminPackRouter.post("/new", uploadProductImages, createPack);
AdminPackRouter.get("/get", getPackList);
AdminPackRouter.get("/get/all", getAllPacks);
AdminPackRouter.get("/get/:id", getPackById);
AdminPackRouter.delete("/delete/:id", deletePack);
AdminPackRouter.post("/delete/many", deletePacksInBulk);
AdminPackRouter.put("/update/:id", uploadProductImages, updatePack);
AdminPackRouter.get("/get/store/packs/get-by-slug/:slug", getPackBySlug);

module.exports = AdminPackRouter;
