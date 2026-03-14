const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "API OK" });
});

// auth (if you want to mount here instead of server.js)
router.use("/auth", require("./auth/auth.routes"));

// profile
router.use("/profile", require("./portfolio/profile/profile.routes"));
router.use("/skills", require("./portfolio/skills/skills.routes"));
router.use("/projects", require("./portfolio/projects/projects.routes"));
router.use("/contact", require("./portfolio/contact/contact.routes"));
router.use("/education", require("./portfolio/education/education.routes"));
router.use("/experience", require("./portfolio/experience/experience.routes"));





module.exports = router;
