const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");

const apiRoutes = require("../routes");   // central router
const authRoutes = require("../auth/auth.routes"); // optional direct mount
const errorHandler = require("../middleware/error.handler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();
//app.use("/api", routes);

// Option A (Recommended): mount everything under /api via routes.js
app.use("/api", apiRoutes);
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});
// after app.use("/api", routes)
app.use(errorHandler);

// Option B (Optional): keep auth separate (not needed if already in routes.js)
// app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




