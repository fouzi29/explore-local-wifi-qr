const nodemailer = require('nodemailer');

async function testGmail() {
  console.log('Testing Gmail Transporter with App Password...');

  const transporterSSL = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'fzfemass.1021@gmail.com',
      pass: 'gxsp shuw jeje cqmc'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Verifying SSL Transporter (465)...');
    await transporterSSL.verify();
    console.log('✅ SSL Transporter VERIFIED SUCCESSFULLY!');
    
    const info = await transporterSSL.sendMail({
      from: '"WiFiPulse System" <fzfemass.1021@gmail.com>',
      to: 'fouzi.cse@gmail.com',
      subject: '🎉 SUCCESS: WiFiPulse Automated Email System Connected!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #16a34a; border-radius: 12px; padding: 24px;">
          <h2 style="color: #16a34a; margin-top: 0;">🎉 Gmail App Password Verified!</h2>
          <p>Your WiFiPulse platform has successfully connected to Gmail SMTP.</p>
          <p>Venue owners and platform creators will now receive automated lead and setup alerts instantly!</p>
        </div>
      `
    });
    console.log('🚀 TEST EMAIL DISPATCHED SUCCESSFULLY! Message ID:', info.messageId);
  } catch (err) {
    console.error('❌ SSL Transporter Error:', err);
  }
}

testGmail();
