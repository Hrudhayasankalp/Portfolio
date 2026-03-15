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

// Request Logging
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

connectDB();
//app.use("/api", routes);

// Option A (Recommended): mount everything under /api via routes.js
app.use("/api", apiRoutes);

// Debug endpoint to list routes (remove after debugging)
app.get("/api/debug-routes", (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push(`${Object.keys(middleware.route.methods).join(',').toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const path = handler.route.path;
          const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
          routes.push(`${methods} /api${path}`);
        }
      });
    }
  });
  res.json({ routes });
});

app.use((req, res, next) => {
  console.log(`❌ 404 Not Found: ${req.method} ${req.originalUrl || req.url}`);
  res.status(404).json({ 
    message: "Route not found",
    debug: {
      method: req.method,
      url: req.url,
      originalUrl: req.originalUrl
    }
  });
});
// after app.use("/api", routes)
app.use(errorHandler);

// Option B (Optional): keep auth separate (not needed if already in routes.js)
// app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




