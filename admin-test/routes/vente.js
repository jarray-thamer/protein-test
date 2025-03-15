const { Router } = require("express");
const {
  updateVenteStatus,
  getAllVentes,
  createVente,
  getVenteById,
  deleteVente,
  deleteVenteMany,
  updateVente,
  createCommandeVente,
} = require("../controllers/vente");

const VenteRoutes = Router();

VenteRoutes.post("/new", createVente);
VenteRoutes.post("/commande/new", createCommandeVente);
VenteRoutes.get("/get/all", getAllVentes);
VenteRoutes.put("/update-status/:id", updateVenteStatus);
VenteRoutes.get("/get/:id", getVenteById);
VenteRoutes.delete("/delete/:id", deleteVente);
VenteRoutes.post("/delete/many", deleteVenteMany);
VenteRoutes.put("/update/:id", updateVente);
module.exports = VenteRoutes;
