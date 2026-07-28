const nodemailer = require('nodemailer');

async function testGmail() {
  console.log('Testing Gmail Transporters...');

  // Config A: Port 465 SSL
  const transporterSSL = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'fzfemass.1021@gmail.com',
      pass: 'fzfemass@21@(fzm)@g1#f2'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Verifying SSL Transporter (465)...');
    await transporterSSL.verify();
    console.log('SSL Transporter verified successfully!');
    
    const info = await transporterSSL.sendMail({
      from: '"WiFiPulse Tester" <fzfemass.1021@gmail.com>',
      to: 'fouzi.cse@gmail.com',
      subject: '🧪 Diagnostic Test Email from WiFiPulse (SSL 465)',
      text: 'If you receive this email, your Nodemailer Gmail SMTP setup is working 100% perfectly!'
    });
    console.log('Test Email Sent Successfully! Message ID:', info.messageId);
  } catch (err) {
    console.error('SSL Transporter Error:', err);

    console.log('\nTrying Config B: Port 587 TLS...');
    const transporterTLS = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'fzfemass.1021@gmail.com',
        pass: 'fzfemass@21@(fzm)@g1#f2'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    try {
      await transporterTLS.verify();
      console.log('TLS Transporter verified successfully!');
      const info = await transporterTLS.sendMail({
        from: '"WiFiPulse Tester" <fzfemass.1021@gmail.com>',
        to: 'fouzi.cse@gmail.com',
        subject: '🧪 Diagnostic Test Email from WiFiPulse (TLS 587)',
        text: 'If you receive this email, TLS 587 is working!'
      });
      console.log('TLS Email Sent Successfully! Message ID:', info.messageId);
    } catch (err2) {
      console.error('TLS Transporter Error:', err2);
    }
  }
}

testGmail();
