const express = require("express");
const router = express.Router();
const ctrl = require("./leetcode.controller");

// Public route to fetch LeetCode statistics
router.get("/stats", ctrl.getStats);

module.exports = router;
