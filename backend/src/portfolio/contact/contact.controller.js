const Contact = require("./contact.model");
const nodemailer = require("nodemailer");

exports.sendMessage = async (req, res, next) => {
  try {
    const msg = await Contact.create(req.body);

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "hrudayasankalp@gmail.com",
        subject: `New Portfolio Message from ${msg.name}`,
        text: `Name: ${msg.name}\nEmail: ${msg.email}\n\nMessage:\n${msg.message}`,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json(msg);
  } catch (err) {
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
