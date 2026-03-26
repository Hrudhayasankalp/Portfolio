const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./.env" });

async function testEmail() {
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
    from: `"Test User" <${process.env.EMAIL_USER}>`,
    to: "hrudayasankalp@gmail.com",
    subject: "Test Email from Portfolio Backend (Custom From)",
    text: "This is a test email with a custom from name.",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
}

testEmail();
