const { Router } = require("express");
const {
  getGeneralData,
  updateGeneralInformation,
  getAdvancedData,
  updateAdvancedInformation,
  getInformation,
  getMaterielImageSection,
  updateMaterielImageSection,
  deleteMaterielImageSection,
  getAllSlides,
  addSlideImages,
  updateSlidesOrder,
  deleteSlideImage,
  uploadSlideImages,
  getAllBrands,
  addBrandImages,
  deleteBrandImage,
  updateBrandsOrder,
} = require("../controllers/information");
const { upload } = require("../middleware/multer");
const AdminInformationRouter = Router();

AdminInformationRouter.get("/general/get", getGeneralData);
AdminInformationRouter.put(
  "/general/update",
  upload.single("logo"),
  updateGeneralInformation
);
AdminInformationRouter.get("/advanced/get", getAdvancedData);
AdminInformationRouter.put("/advanced/update", updateAdvancedInformation);
AdminInformationRouter.get("/get/information", getInformation);
AdminInformationRouter.get(
  "/homepage/get/materielimage",
  getMaterielImageSection
);
AdminInformationRouter.put(
  "/homepage/update/materielimage",
  upload.single("image"),
  updateMaterielImageSection
);
AdminInformationRouter.delete(
  "/homepage/delete/materielimage",
  deleteMaterielImageSection
);

AdminInformationRouter.get("/homepage/get/all/slides", getAllSlides);
AdminInformationRouter.post(
  "/homepage/upload/slides",
  uploadSlideImages,
  addSlideImages
);
AdminInformationRouter.put("/homepage/slides/order", updateSlidesOrder);

AdminInformationRouter.delete(
  "/homepage/delete/slides/:imgId",
  deleteSlideImage
);
AdminInformationRouter.get("/homepage/get/all/brands", getAllBrands);
AdminInformationRouter.post(
  "/homepage/upload/brands",
  uploadSlideImages,
  addBrandImages
);
AdminInformationRouter.delete(
  "/homepage/delete/brands/:imgId",
  deleteBrandImage
);
AdminInformationRouter.put("/homepage/brands/order", updateBrandsOrder);

module.exports = AdminInformationRouter;
