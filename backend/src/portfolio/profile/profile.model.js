const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String },
    email: { type: String },
    github: { type: String },
    linkedin: { type: String },
    website: { type: String },
    avatar: { type: String }, // URL to image
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
