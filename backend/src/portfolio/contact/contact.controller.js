const Contact = require("./contact.model");
const nodemailer = require("nodemailer");
const dns = require("dns");

try {
  if (typeof dns.setDefaultResultOrder === "function") {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch (e) {
  console.log("IPv4 defaulting not supported");
}

exports.sendMessage = async (req, res, next) => {
  try {
    const msg = await Contact.create(req.body);

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log(`📧 Attempting to send email from ${process.env.EMAIL_USER} to hrudayasankalp@gmail.com`);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"${msg.name}" <${process.env.EMAIL_USER}>`,
        to: "hrudayasankalp@gmail.com",
        replyTo: msg.email,
        subject: `New Portfolio Message from ${msg.name}`,
        text: `Name: ${msg.name}\nEmail: ${msg.email}\n\nMessage:\n${msg.message}`,
        priority: 'high',
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.messageId);
      } catch (mailErr) {
        console.error("❌ Email sending failed:", mailErr.message);
        const err = new Error("Email sending failed. Check backend environment variables.");
        err.statusCode = 500;
        throw err;
      }
    } else {
      console.warn("⚠️ EMAIL_USER or EMAIL_PASS not set in environment variables.");
      const err = new Error("Email credentials not configured on the server.");
      err.statusCode = 500;
      throw err;
    }
    
    // Return 201 successfully so the frontend Contact form shows the "Message Sent" overlay
    res.status(201).json(msg);
  } catch (err) {
    console.error("🔥 Error in sendMessage:", err);
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const msgs = await Contact.find().sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err) {
    next(err);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const msg = await Contact.findByIdAndDelete(req.params.id);
    if (!msg) {
      const e = new Error("Message not found");
      e.statusCode = 404;
      throw e;
    }
    res.json({ message: "Message deleted" });
  } catch (err) {
    next(err);
  }
};
