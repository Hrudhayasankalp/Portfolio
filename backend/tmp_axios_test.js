require('dotenv').config({path: 'd:/project/portfolio/backend/.env'});
const axios = require('axios');

async function test() {
  const emailData = {
    service_id: process.env.EMAILJS_SERVICE_ID?.trim(),
    template_id: process.env.EMAILJS_TEMPLATE_ID?.trim(),
    user_id: process.env.EMAILJS_PUBLIC_KEY?.trim(),
    template_params: {
      name: 'TestUser',
      email: 'test@test.com',
      message: 'Hi'
    }
  };
  
  console.log("Testing keys:", {
      service_id: emailData.service_id,
      template_id: emailData.template_id,
      user_id: emailData.user_id ? "PRESENT" : "MISSING"
  });

  try {
    const response = await axios.post("https://api.emailjs.com/api/v1.0/email/send", emailData);
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', response.data);
  } catch (e) {
    if (e.response) {
      console.error('❌ EmailJS API Error:', e.response.status, e.response.data);
    } else {
      console.error('❌ Request Error:', e.message);
    }
  }
}
test();
