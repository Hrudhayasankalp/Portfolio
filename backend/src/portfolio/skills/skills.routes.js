const express = require("express");
const router = express.Router();
const ctrl = require("./skills.controller");
const jwtGuard = require("../../middleware/jwt.guard");
const adminGuard = require("../../middleware/admin.guard");

// Public
router.get("/", ctrl.getSkills);

// Admin only
router.post("/", jwtGuard, adminGuard, ctrl.createSkill);
router.put("/:id", jwtGuard, adminGuard, ctrl.updateSkill);
router.delete("/:id", jwtGuard, adminGuard, ctrl.deleteSkill);

module.exports = router;
