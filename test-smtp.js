const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');

async function testPdfWelcomeEmail() {
  console.log('Testing Venue Welcome Email with PDF Tabletop Stand Attachment...');

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

  // Generate PDF buffer
  const pdfBuffer = await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    doc.fontSize(24).font('Helvetica-Bold').text('RUSTIC ROASTER COFFEE', { align: 'center' });
    doc.fontSize(16).fillColor('#16a34a').text('FREE GUEST WI-FI ACCESS', { align: 'center' });
    doc.moveDown();
    doc.image(qrBuffer, (doc.page.width - 200) / 2, doc.y, { width: 200, height: 200 });
    doc.end();
  });

  try {
    const info = await transporter.sendMail({
      from: '"WiFiPulse System" <fzfemass.1021@gmail.com>',
      to: 'fouzi.cse@gmail.com',
      subject: '🎉 TEST: Printable PDF Tabletop Stand Attached',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #16a34a; border-radius: 12px; padding: 24px;">
          <h2 style="color: #16a34a; margin-top: 0;">🎉 Welcome to WiFiPulse!</h2>
          <p>Your printable <strong>PDF Tabletop Stand</strong> is attached to this email!</p>
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
