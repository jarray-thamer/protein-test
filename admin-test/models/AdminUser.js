const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminUserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "super-admin"],
    default: "admin",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const AdminUser = mongoose.model("AdminUser", AdminUserSchema);
module.exports = AdminUser;
