const Admin = require("./auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, password: hash, email });
    res.json({ message: "Admin created", admin });
  } catch (err) {
    res.status(400).json({ message: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "No account with that email address exists." });
    }

    const token = crypto.randomBytes(20).toString("hex");
    admin.resetPasswordToken = token;
    admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await admin.save();

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.ADMIN_URL}/reset-password/${token}`;

    const mailOptions = {
      to: admin.email,
      from: process.env.EMAIL_USER,
      subject: "Portfolio Admin Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `${resetUrl}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "An e-mail has been sent to " + admin.email + " with further instructions." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error in forgot password process", error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired." });
    }

    const { password } = req.body;
    admin.password = await bcrypt.hash(password, 10);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;

    await admin.save();
    res.json({ message: "Success! Your password has been changed." });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password", error: err.message });
  }
};
