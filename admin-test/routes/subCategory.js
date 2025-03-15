const { Router } = require("express");

const {
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
  getSubCategoriesByCategory,
  getAllSubCategories,
} = require("../controllers/subcategory");

const adminSubCategoryRouter = Router();

adminSubCategoryRouter.post("/new", createSubCategory);
adminSubCategoryRouter.delete("/delete/:id", deleteSubCategory);
adminSubCategoryRouter.put("/update/:id", updateSubCategory);
adminSubCategoryRouter.get(
  "/get/by-category/:categoryId",
  getSubCategoriesByCategory
);
adminSubCategoryRouter.get("/get/all", getAllSubCategories);

module.exports = adminSubCategoryRouter;
