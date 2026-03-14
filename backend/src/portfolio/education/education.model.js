const mongoose = require("mongoose");

const EducationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    field: { type: String, required: true, trim: true },
    startYear: { type: Number, required: true },
    endYear: { type: Number }, // null if currently studying
    grade: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Education", EducationSchema);
