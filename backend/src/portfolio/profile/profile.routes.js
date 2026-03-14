const express = require("express");
const router = express.Router();

const ctrl = require("./profile.controller");
const jwtGuard = require("../../middleware/jwt.guard");

router.get("/", ctrl.getProfile);
router.post("/", jwtGuard, ctrl.createProfile);
router.put("/", jwtGuard, ctrl.updateProfile);

module.exports = router;
