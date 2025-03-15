// messageControllers.js

const Messages = require("../models/messages");

exports.createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Please provide name, email and message",
      });
    }

    // Create new message
    const newMessage = await Messages.create({
      name,
      email,
      phone, // Optional
      subject, // Optional
      message,
      status: "Unread", // Default status
    });

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Messages.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

// Get single message by ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await Messages.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

// Update message status
exports.updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status input
    if (!status || !["Read", "Replyed", "Unread"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Status must be 'Read', 'Replyed', or 'Unread'",
      });
    }

    const message = await Messages.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    // Update only the status field
    message.status = status;
    await message.save();

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};
