require('dotenv').config({path: 'd:/project/portfolio/backend/.env'});
async function test() {
  const emailData = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    template_params: {
      name: 'TestUser',
      email: 'test@test.com',
      message: 'Hi'
    }
  };
  console.log("Testing with keys:", {
      service_id: emailData.service_id,
      template_id: emailData.template_id,
      user_id: emailData.user_id ? "PRESENT" : "MISSING"
  });
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
  } catch (e) {
    console.error('Error:', e);
  }
}
test();
