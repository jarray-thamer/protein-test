const { Router } = require("express");

const {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
  getCategoryById,
} = require("../controllers/category");
const { upload } = require("../middleware/multer");

const adminCategoryRoutes = Router();

adminCategoryRoutes.post("/new", upload.single("image"), createCategory);
adminCategoryRoutes.delete("/delete/:id", deleteCategory);
adminCategoryRoutes.put("/update/:id", upload.single("image"), updateCategory);
adminCategoryRoutes.get("/get/all", getAllCategory);
adminCategoryRoutes.get("/get/:id", getCategoryById);

module.exports = adminCategoryRoutes;
