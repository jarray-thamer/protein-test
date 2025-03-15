const { Router } = require("express");
const {
  createProduct,
  deleteProduct,
  updateProduct,
  getProducts,
  getProductById,
  getAllProductsNormal,
  deleteManyProducts,

  getProductBySlug,
  getProductsWithMilleurVente,
  getProductsWithNewVente,
  getProductsWithVenteFlashVente,
  getProductsWithMaterielDeMusculation,
  getMaxPrice,
} = require("../controllers/product");
const { uploadProductImages } = require("../middleware/multer");

const AdminProductRouter = Router();

AdminProductRouter.post("/new", uploadProductImages, createProduct);
AdminProductRouter.get("/get", getProducts);
AdminProductRouter.get("/get/all", getAllProductsNormal);
AdminProductRouter.get("/get/:id", getProductById); // Get product by ID
AdminProductRouter.put("/update/:id", uploadProductImages, updateProduct);
AdminProductRouter.delete("/delete/:id", deleteProduct);
AdminProductRouter.post("/delete/many", deleteManyProducts);

AdminProductRouter.get("/get/store/products/top", getProductsWithMilleurVente);
AdminProductRouter.get("/get/store/products/new", getProductsWithNewVente);
AdminProductRouter.get(
  "/get/store/products/vente-flash",
  getProductsWithVenteFlashVente
);
AdminProductRouter.get(
  "/get/store/products/materiel-de-musculation",
  getProductsWithMaterielDeMusculation
);

AdminProductRouter.get(
  "/get/store/products/get-by-slug/:slug",
  getProductBySlug
);
AdminProductRouter.get("/get-max-price", getMaxPrice);

module.exports = AdminProductRouter;
