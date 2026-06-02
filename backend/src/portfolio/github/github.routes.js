const express = require("express");
const router = express.Router();
const ctrl = require("./github.controller");

// Public route to fetch GitHub statistics
router.get("/stats", ctrl.getStats);

module.exports = router;
