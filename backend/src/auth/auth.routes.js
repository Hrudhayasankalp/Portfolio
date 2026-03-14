const router = require("express").Router();
const ctrl = require("./auth.controller");   // <-- match filename

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.post("/forgot-password", ctrl.forgotPassword);
router.post("/reset-password/:token", ctrl.resetPassword);

module.exports = router;
