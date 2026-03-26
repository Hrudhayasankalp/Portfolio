require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // True for 465, false for other ports
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Test Name" <${process.env.EMAIL_USER}>`, 
    to: "hrudayasankalp@gmail.com",
    replyTo: "test@example.com",
    subject: `Test Email`,
    text: `This is a test message.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
  } catch (mailErr) {
    console.error("❌ Email sending failed:", mailErr);
  }
}

testEmail();
