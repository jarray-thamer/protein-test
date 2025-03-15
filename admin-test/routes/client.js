const { Router } = require("express");
const {
  createGuestClient,
  getAllClients,
  deleteManyClients,
  getClientById,
  updateClient,
  subscribeButton,
  sendSMS,
  sendEmail,
} = require("../controllers/client");

const ClientRouter = Router();

ClientRouter.post("/new", createGuestClient);
ClientRouter.get("/get/all", getAllClients);
ClientRouter.post("/delete/many", deleteManyClients);
ClientRouter.get("/get/by-id/:id", getClientById);
ClientRouter.put("/update/:id", updateClient);
ClientRouter.put("/subscribe", subscribeButton);
ClientRouter.post("/send-sms", sendSMS);
ClientRouter.post("/send-email", sendEmail);

module.exports = ClientRouter;
