const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });
const Contact = require("./src/portfolio/contact/contact.model");

async function checkMessages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    const messages = await Contact.find().sort({ createdAt: -1 }).limit(5);
    console.log("Total messages in DB:", await Contact.countDocuments());
    console.log("Recent messages:", JSON.stringify(messages, null, 2));
    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Database check failed:", error);
  }
}

checkMessages();
