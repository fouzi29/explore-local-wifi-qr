import PDFDocument from 'pdfkit';
import { VenueSettings } from './storage';

/**
 * Generates a high-quality PDF Buffer for the printable tabletop QR stand
 */
export async function generateTabletopStandPdfBuffer(
  venue: VenueSettings,
  qrBuffer: Buffer
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Create a standard A4 or Letter PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        info: {
          Title: `${venue.name} - Tabletop QR Stand`,
          Author: 'WiFiPulse System'
        }
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Background Card Container
      const pageWidth = doc.page.width;
      const cardWidth = 400;
      const cardHeight = 540;
      const cardX = (pageWidth - cardWidth) / 2;
      const cardY = 60;

      // Draw Outer Card Border Box
      doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 16)
         .lineWidth(2)
         .strokeColor('#e2e8f0')
         .fillColor('#ffffff')
         .fillAndStroke();

      // Header Dark Banner Box
      doc.roundedRect(cardX + 20, cardY + 20, cardWidth - 40, 70, 12)
         .fillColor('#0f172a')
         .fill();

      // Venue Title Text inside Banner
      doc.fillColor('#ffffff')
         .fontSize(20)
         .font('Helvetica-Bold')
         .text(venue.name.toUpperCase(), cardX + 20, cardY + 36, {
           width: cardWidth - 40,
           align: 'center'
         });

      // Tagline
      doc.fillColor('#16a34a')
         .fontSize(10)
         .font('Helvetica-Bold')
         .text((venue.tagline || 'FREE GUEST WI-FI ACCESS').toUpperCase(), cardX + 20, cardY + 62, {
           width: cardWidth - 40,
           align: 'center'
         });

      // Main Headline
      doc.fillColor('#0f172a')
         .fontSize(22)
         .font('Helvetica-Bold')
         .text('FREE HIGH-SPEED WI-FI', cardX + 20, cardY + 115, {
           width: cardWidth - 40,
           align: 'center'
         });

      // Instruction Subtitle
      doc.fillColor('#64748b')
         .fontSize(11)
         .font('Helvetica')
         .text('Point your smartphone camera to scan & unlock internet', cardX + 20, cardY + 145, {
           width: cardWidth - 40,
           align: 'center'
         });

      // Center QR Code Image
      const qrSize = 220;
      const qrX = (pageWidth - qrSize) / 2;
      const qrY = cardY + 180;

      // Light background box behind QR
      doc.roundedRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 12)
         .fillColor('#f8fafc')
         .strokeColor('#cbd5e1')
         .lineWidth(1)
         .fillAndStroke();

      // Embed QR PNG Buffer
      doc.image(qrBuffer, qrX, qrY, {
        width: qrSize,
        height: qrSize
      });

      // Wi-Fi Details Box at Bottom
      const detailsY = cardY + 430;
      doc.moveTo(cardX + 30, detailsY)
         .lineTo(cardX + cardWidth - 30, detailsY)
         .lineWidth(1)
         .strokeColor('#e2e8f0')
         .stroke();

      doc.fillColor('#334155')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text(`Network (SSID): ${venue.wifi.ssid}`, cardX + 30, detailsY + 16, {
           width: cardWidth - 60,
           align: 'center'
         });

      doc.fillColor('#334155')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text(`Password: ${venue.wifi.password}`, cardX + 30, detailsY + 36, {
           width: cardWidth - 60,
           align: 'center'
         });

      // Footer branding
      doc.fillColor('#94a3b8')
         .fontSize(9)
         .font('Helvetica')
         .text('Powered by WiFiPulse • https://explore-local-wifi-qr.vercel.app', cardX + 20, cardY + cardHeight - 25, {
           width: cardWidth - 40,
           align: 'center'
         });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
