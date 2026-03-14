const express = require("express");
const router = express.Router();
const ctrl = require("./contact.controller");
const jwtGuard = require("../../middleware/jwt.guard");

// Public (from frontend contact form)
router.post("/", ctrl.sendMessage);

// Admin only
router.get("/", jwtGuard, ctrl.getMessages);
router.delete("/:id", jwtGuard, ctrl.deleteMessage);

module.exports = router;
