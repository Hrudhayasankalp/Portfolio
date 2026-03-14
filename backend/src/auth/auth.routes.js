const router = require("express").Router();
const ctrl = require("./auth.controller");   // <-- match filename

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);

module.exports = router;
