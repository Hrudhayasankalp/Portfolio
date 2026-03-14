const router = require("express").Router();
const ctrl = require("./education.controller");
const jwtGuard = require("../../middleware/jwt.guard");
const adminGuard = require("../../middleware/admin.guard");

router.get("/", ctrl.getEducation);
router.post("/", jwtGuard, adminGuard, ctrl.createEducation);
router.put("/:id", jwtGuard, adminGuard, ctrl.updateEducation);
router.delete("/:id", jwtGuard, adminGuard, ctrl.deleteEducation);


module.exports = router;
