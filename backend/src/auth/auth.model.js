const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true, sparse: true },
  password: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

module.exports = mongoose.model("Admin", AdminSchema);
