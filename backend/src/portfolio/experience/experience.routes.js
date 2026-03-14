const router = require("express").Router();
const ctrl = require("./experience.controller");
const jwtGuard = require("../../middleware/jwt.guard");
const adminGuard = require("../../middleware/admin.guard");



// Admin
router.get("/", ctrl.getExperience);
router.post("/", jwtGuard, adminGuard, ctrl.createExperience);
router.put("/:id", jwtGuard, adminGuard, ctrl.updateExperience);
router.delete("/:id", jwtGuard, adminGuard, ctrl.deleteExperience);

module.exports = router;
