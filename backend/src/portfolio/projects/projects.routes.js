const router = require("express").Router();
const ctrl = require("./projects.controller");
const jwtGuard = require("../../middleware/jwt.guard");
const adminGuard = require("../../middleware/admin.guard");

// Public
router.get("/", ctrl.getProjects);
router.post("/", jwtGuard, adminGuard, ctrl.createProject);
router.put("/:id", jwtGuard, adminGuard, ctrl.updateProject);
router.delete("/:id", jwtGuard, adminGuard, ctrl.deleteProject);

module.exports = router;
