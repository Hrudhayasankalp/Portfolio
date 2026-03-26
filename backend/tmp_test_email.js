const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./.env" });

async function testEmail() {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "****" : "NOT SET");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "hrudayasankalp@gmail.com",
    subject: "Test Email from Portfolio Backend",
    text: "This is a test email to verify the SMTP configuration.",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
}

testEmail();
