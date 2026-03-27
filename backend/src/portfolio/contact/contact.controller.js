const Contact = require("./contact.model");
const axios = require("axios");

exports.sendMessage = async (req, res, next) => {
  try {
    const msg = await Contact.create(req.body);

    const serviceId = process.env.EMAILJS_SERVICE_ID?.trim();
    const templateId = process.env.EMAILJS_TEMPLATE_ID?.trim();
    const publicKey = process.env.EMAILJS_PUBLIC_KEY?.trim();
    const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim();

    if (serviceId && templateId && publicKey && privateKey) {
      console.log(`📧 Attempting to send email via EmailJS for ${msg.email}`);

      const emailData = {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          name: msg.name,
          email: msg.email,
          message: msg.message,
          from_name: msg.name,
          from_email: msg.email,
          reply_to: msg.email
        }
      };

      try {
        await axios.post("https://api.emailjs.com/api/v1.0/email/send", emailData);
        console.log("✅ Email sent successfully via EmailJS!");
      } catch (mailErr) {
        console.error("❌ Email sending failed:", mailErr.response?.data || mailErr.message);
        const err = new Error("Email sending failed. Plase verify your EmailJS API keys.");
        err.statusCode = 500;
        throw err;
      }
    } else {
      console.warn("⚠️ EmailJS API keys are missing from the environment variables.");
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
