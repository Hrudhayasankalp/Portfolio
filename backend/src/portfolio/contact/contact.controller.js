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
        host: "smtp.gmail.com",
        port: 587,     // Cloud free-tiers often block port 465, 587 is highly recommended
        secure: false, // Use STARTTLS instead of implicit SSL for 587
        family: 4,     // Force Node.js to use IPv4 only, ignoring buggy IPv6 routes completely
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
        return res.status(201).json({ ...msg.toObject(), emailStatus: "sent" });
      } catch (mailErr) {
        console.error("❌ Email sending failed:", mailErr);
        // Explicitly return the Nodemailer error back to the frontend to debug Render issue
        return res.status(500).json({ error: `Nodemailer failed: ${mailErr.message}` });
      }
    } else {
      console.warn("⚠️ EMAIL_USER or EMAIL_PASS not set in environment variables. Skipping email notification.");
      return res.status(500).json({ error: "EMAIL_USER or EMAIL_PASS not found on server." });
    }
  } catch (err) {
    console.error("🔥 Error in sendMessage:", err);
    err.statusCode = 400;
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
