const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

async function testWelcomeEmail() {
  console.log('Testing Venue Welcome Email with Embedded QR Code & Stand Attachment...');

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

  const qrBuffer = await QRCode.toBuffer('https://explore-local-wifi-qr.vercel.app/v/rustic-roaster', { width: 500 });

  const printableStandHtml = `
    <!DOCTYPE html><html><body style="font-family:Arial;text-align:center;padding:40px;background:#0f172a;color:white;">
      <div style="background:white;color:#0f172a;max-width:400px;margin:0 auto;padding:30px;border-radius:20px;">
        <h2>RUSTIC ROASTER COFFEE</h2>
        <p style="color:#16a34a;font-weight:bold;">FREE HIGH-SPEED GUEST WI-FI</p>
        <img src="cid:qrcode_image" style="width:200px;height:200px;" />
        <p>Scan to Connect & Unlock Local Perks</p>
      </div>
    </body></html>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"WiFiPulse System" <fzfemass.1021@gmail.com>',
      to: 'fouzi.cse@gmail.com',
      subject: '🎉 TEST: Opening Welcome Email with Embedded QR & Printable Stand Attached',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #16a34a; border-radius: 12px; padding: 24px;">
          <h2 style="color: #16a34a; margin-top: 0;">🎉 Welcome to WiFiPulse!</h2>
          <p>Your venue portal for <strong>Rustic Roaster Coffee</strong> is Live!</p>
          <div style="text-align: center; margin: 20px 0; background: #f8fafc; padding: 20px; border-radius: 12px;">
            <h3>Your Tabletop QR Code:</h3>
            <img src="cid:qrcode_image" style="width: 200px; height: 200px; border-radius: 12px;" />
          </div>
          <p>Printable tabletop stand HTML document is attached to this email!</p>
        </div>
      `,
      attachments: [
        {
          filename: 'rustic-roaster_qr_code.png',
          content: qrBuffer,
          cid: 'qrcode_image'
        },
        {
          filename: 'rustic-roaster_tabletop_stand.html',
          content: Buffer.from(printableStandHtml, 'utf-8'),
          contentType: 'text/html'
        }
      ]
    });

    console.log('✅ Welcome email with embedded QR code & attachment sent successfully! MessageID:', info.messageId);
  } catch (err) {
    console.error('❌ Error sending welcome email:', err);
  }
}

testWelcomeEmail();
