// messageRoutes.js

const { Router } = require("express");
const {
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  createMessage,
} = require("../controllers/messages");
const cors = require("cors");

const messagesRoutes = Router();

// Define routes
messagesRoutes.get("/get", getAllMessages);
messagesRoutes.get("/:id", getMessageById);
messagesRoutes.patch("/:id/status", updateMessageStatus);
messagesRoutes.post("/new", createMessage);

module.exports = messagesRoutes;
