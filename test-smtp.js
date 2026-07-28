const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const { generateTabletopStandPdfBuffer } = require('./lib/pdf');

async function testPdfWelcomeEmail() {
  console.log('Testing Venue Welcome Email with PDF Tabletop Stand (with Logo & QR)...');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'fzfemass.1021@gmail.com',
      pass: 'gxspshuwjejecqmc'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const venue = {
    id: 'rustic-roaster',
    name: 'Rustic Roaster Cafe',
    slug: 'rustic-roaster',
    tagline: 'Fresh Coffee & High-Speed Wi-Fi',
    accentColor: '#16a34a',
    logoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop',
    wifi: {
      ssid: 'RusticRoaster_Guest',
      password: 'CoffeeWifi2026'
    }
  };

  const portalUrl = 'https://explore-local-wifi-qr.vercel.app/v/rustic-roaster';
  const qrBuffer = await QRCode.toBuffer(portalUrl, { width: 500, margin: 1 });

  // Generate PDF buffer using lib/pdf
  const pdfBuffer = await generateTabletopStandPdfBuffer(venue, qrBuffer);

  try {
    const info = await transporter.sendMail({
      from: '"WiFiPulse System" <fzfemass.1021@gmail.com>',
      to: 'fouzi.cse@gmail.com',
      subject: '🎉 TEST: Printable PDF Tabletop Stand with Logo Attached',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #16a34a; border-radius: 12px; padding: 24px;">
          <h2 style="color: #16a34a; margin-top: 0;">🎉 Welcome to WiFiPulse!</h2>
          <p>Your printable <strong>PDF Tabletop Stand with Logo & QR Code</strong> is attached to this email!</p>
        </div>
      `,
      attachments: [
        {
          filename: 'rustic-roaster_tabletop_stand.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });

    console.log('✅ Welcome email with PDF attachment sent successfully! MessageID:', info.messageId);
  } catch (err) {
    console.error('❌ Error sending welcome email:', err);
  }
}

testPdfWelcomeEmail();
