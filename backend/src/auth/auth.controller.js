const Admin = require("./auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ username, password: hash });

  res.json({ msg: "Admin created", admin });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ msg: "Invalid credentials" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ msg: "Invalid credentials" });

 const token = jwt.sign(
  { id: admin._id, role: "admin" },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

  res.json({ token });
};
