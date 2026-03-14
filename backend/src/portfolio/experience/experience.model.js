const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: String, // keep string for flexibility (e.g., "Jan 2025")
      required: true,
    },
    endDate: {
      type: String, // "Present" or "Mar 2025"
      default: "Present",
    },
    technologies: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", ExperienceSchema);
