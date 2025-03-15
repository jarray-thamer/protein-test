const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessagesSchema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    subject: { type: String },
    message: { type: String },
    status: { type: String, default: "Unread" },
  },
  { timestamps: true }
);

const Messages =
  mongoose.models.Messages || mongoose.model("Messages", MessagesSchema);

module.exports = Messages;
