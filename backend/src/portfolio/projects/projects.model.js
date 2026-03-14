const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    techStack: {
      type: [String], // ["React", "Node", "MongoDB"]
      default: [],
    },
    liveUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    image: {
      type: String, // URL (Cloudinary later)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
