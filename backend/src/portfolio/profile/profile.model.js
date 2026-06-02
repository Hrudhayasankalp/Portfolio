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
    leetcodeUsername: { type: String, default: "sankalp_nrnh" },
    githubUsername: { type: String, default: "Hrudhayasankalp" },
    geeksforgeeksUsername: { type: String, default: "" },
    geeksforgeeks: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
