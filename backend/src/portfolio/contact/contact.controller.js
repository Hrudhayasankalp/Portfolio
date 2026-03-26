const Contact = require("./contact.model");
const nodemailer = require("nodemailer");

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
        return res.status(201).json({ ...msg.toObject(), emailStatus: "sent" });
      } catch (mailErr) {
        console.error("❌ Email sending failed:", mailErr);
        // Return 500 error so the frontend is aware the email failed
        return res.status(500).json({ message: "Message saved, but failed to send email.", error: mailErr.message });
      }
    } else {
      console.warn("⚠️ EMAIL_USER or EMAIL_PASS not set in environment variables. Skipping email notification.");
      // Return 500 error so developer is aware it was skipped due to missing config
      return res.status(500).json({ message: "Message saved, but email skipped due to missing server configuration." });
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
