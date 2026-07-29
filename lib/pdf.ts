import PDFDocument from 'pdfkit';
import { VenueSettings } from './storage';

async function getLogoBuffer(logoUrl?: string): Promise<Buffer | null> {
  if (!logoUrl || !logoUrl.trim()) return null;
  const url = logoUrl.trim();
  try {
    if (url.startsWith('data:image/')) {
      const base64Data = url.split(',')[1];
      if (base64Data) {
        return Buffer.from(base64Data, 'base64');
      }
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const res = await fetch(url);
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }
    }
  } catch (err) {
    console.error('Failed to load logo buffer for PDF:', err);
  }
  return null;
}

/**
 * Generates a high-quality PDF Buffer for the printable tabletop QR stand
 */
export async function generateTabletopStandPdfBuffer(
  venue: VenueSettings,
  qrBuffer: Buffer
): Promise<Buffer> {
  const logoBuffer = await getLogoBuffer(venue.logoUrl);

  return new Promise((resolve, reject) => {
    try {
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

      const pageWidth = doc.page.width;
      const cardWidth = 420;
      const cardHeight = 560;
      const cardX = (pageWidth - cardWidth) / 2;
      const cardY = 50;

      // Draw Outer Card Container
      doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 20)
         .lineWidth(2)
         .strokeColor('#cbd5e1')
         .fillColor('#ffffff')
         .fillAndStroke();

      // Header Banner Box
      const accentColor = venue.accentColor || '#16a34a';
      doc.roundedRect(cardX + 20, cardY + 20, cardWidth - 40, 80, 14)
         .fillColor('#0f172a')
         .fill();

      // Header Text / Logo positioning
      let titleY = cardY + 36;

      if (logoBuffer) {
        try {
          // Render venue logo inside header banner box
          const logoWidth = 100;
          const logoHeight = 35;
          const logoX = (pageWidth - logoWidth) / 2;
          doc.image(logoBuffer, logoX, cardY + 25, {
            fit: [logoWidth, logoHeight],
            align: 'center',
            valign: 'center'
          });
          titleY = cardY + 62;
        } catch (e) {
          // If logo buffer fails, keep standard text alignment
        }
      }

      // Venue Title Text inside Banner
      doc.fillColor('#ffffff')
         .fontSize(18)
         .font('Helvetica-Bold')
         .text(venue.name.toUpperCase(), cardX + 20, titleY, {
           width: cardWidth - 40,
           align: 'center'
         });

      // Tagline
      doc.fillColor(accentColor)
         .fontSize(10)
         .font('Helvetica-Bold')
         .text((venue.tagline || 'FREE GUEST WI-FI ACCESS').toUpperCase(), cardX + 20, titleY + 22, {
           width: cardWidth - 40,
           align: 'center'
         });

      // Main Headline
      doc.fillColor('#0f172a')
         .fontSize(22)
         .font('Helvetica-Bold')
         .text('FREE HIGH-SPEED WI-FI', cardX + 20, cardY + 120, {
           width: cardWidth - 40,
           align: 'center'
         });

      // Instruction Subtitle
      doc.fillColor('#64748b')
         .fontSize(11)
         .font('Helvetica')
         .text('Scan for Instant Wi-Fi Access & Exclusive Local Rewards', cardX + 20, cardY + 150, {
           width: cardWidth - 40,
           align: 'center'
         });

      // Center QR Code Image Box
      const qrSize = 220;
      const qrX = (pageWidth - qrSize) / 2;
      const qrY = cardY + 185;

      // Light background box behind QR
      doc.roundedRect(qrX - 12, qrY - 12, qrSize + 24, qrSize + 54, 16)
         .fillColor('#f8fafc')
         .strokeColor('#e2e8f0')
         .lineWidth(1.5)
         .fillAndStroke();

      // Embed QR PNG Buffer
      doc.image(qrBuffer, qrX, qrY, {
        width: qrSize,
        height: qrSize
      });

      // Embed Center Logo over QR Code if logo is present
      if (logoBuffer) {
        try {
          const qrLogoSize = 44;
          const qrLogoX = (pageWidth - qrLogoSize) / 2;
          const qrLogoY = qrY + (qrSize - qrLogoSize) / 2;
          const pad = 6;

          // White rounded background box behind center logo on QR
          doc.roundedRect(qrLogoX - pad, qrLogoY - pad, qrLogoSize + (pad * 2), qrLogoSize + (pad * 2), 8)
             .fillColor('#ffffff')
             .strokeColor('#cbd5e1')
             .lineWidth(1)
             .fillAndStroke();

          doc.image(logoBuffer, qrLogoX, qrLogoY, {
            fit: [qrLogoSize, qrLogoSize],
            align: 'center',
            valign: 'center'
          });
        } catch (e) {
          // Fallback if logo fails
        }
      }

      // Add "Point Camera to Scan" text under QR Code (inside the box)
      doc.fillColor('#0f172a')
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('✨ Point Camera to Scan', cardX + 20, qrY + qrSize + 16, {
           width: cardWidth - 40,
           align: 'center'
         });

      // Wi-Fi Details Box at Bottom - 3 Steps Layout
      const detailsY = cardY + 465;
      doc.moveTo(cardX + 40, detailsY)
         .lineTo(cardX + cardWidth - 40, detailsY)
         .lineWidth(1)
         .strokeColor('#e2e8f0')
         .stroke();

      const colWidth = (cardWidth - 80) / 3;

      // Col 1
      doc.fillColor(accentColor).fontSize(11).font('Helvetica-Bold').text('1. SCAN', cardX + 40, detailsY + 20, { width: colWidth, align: 'center' });
      doc.fillColor('#64748b').fontSize(9).font('Helvetica').text('Open Camera', cardX + 40, detailsY + 35, { width: colWidth, align: 'center' });

      // Col 2
      doc.fillColor(accentColor).fontSize(11).font('Helvetica-Bold').text('2. ENTER', cardX + 40 + colWidth, detailsY + 20, { width: colWidth, align: 'center' });
      doc.fillColor('#64748b').fontSize(9).font('Helvetica').text('Quick Info', cardX + 40 + colWidth, detailsY + 35, { width: colWidth, align: 'center' });

      // Col 3
      doc.fillColor(accentColor).fontSize(11).font('Helvetica-Bold').text('3. CONNECT', cardX + 40 + (colWidth * 2), detailsY + 20, { width: colWidth, align: 'center' });
      doc.fillColor('#64748b').fontSize(9).font('Helvetica').text('Get Wi-Fi', cardX + 40 + (colWidth * 2), detailsY + 35, { width: colWidth, align: 'center' });

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
