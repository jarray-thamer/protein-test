// messageRoutes.js

const { Router } = require("express");
const {
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  createMessage,
} = require("../controllers/messages");

const messagesRoutes = Router();

// Define routes
messagesRoutes.get("/get", getAllMessages);
messagesRoutes.get("/:id", getMessageById);
messagesRoutes.patch("/:id/status", updateMessageStatus);
messagesRoutes.post("/new", createMessage);

module.exports = messagesRoutes;
