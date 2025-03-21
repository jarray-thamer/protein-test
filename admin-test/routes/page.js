const { Router } = require("express");
const {
  getAllPages,
  createPage,
  updatePage,
  getPageById,
  getPageBySlug,
  deletePage,
} = require("../controllers/pages");

const PageRouter = Router();

PageRouter.get("/get/all", getAllPages);
PageRouter.post("/new", createPage);
PageRouter.put("/edit/:id", updatePage);
PageRouter.get("/get/by-id/:id", getPageById);
PageRouter.get("/get/by-slug/:slug", getPageBySlug);
PageRouter.delete("/delete/:id", deletePage);

module.exports = PageRouter;
