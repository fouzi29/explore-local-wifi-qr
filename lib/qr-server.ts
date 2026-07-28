import QRCode from 'qrcode';
import sharp from 'sharp';

async function fetchLogoBuffer(logoUrl: string): Promise<Buffer | null> {
  try {
    if (logoUrl.startsWith('data:image/')) {
      const base64Data = logoUrl.split(',')[1];
      if (base64Data) return Buffer.from(base64Data, 'base64');
    }
    if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
      const res = await fetch(logoUrl);
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }
    }
  } catch (err) {
    console.error('Failed to fetch logo for QR code:', err);
  }
  return null;
}

/**
 * Generates a high-resolution QR code Buffer with an optional centered logo image for the Server
 */
export async function generateStyledQrCodeBuffer(
  text: string,
  logoUrl?: string,
  accentColor: string = '#16a34a',
  size: number = 500
): Promise<Buffer> {
  // Step 1: Generate base QR code Buffer
  const qrBuffer = await QRCode.toBuffer(text, {
    width: size,
    margin: 1,
    color: {
      dark: accentColor || '#16a34a',
      light: '#ffffff'
    }
  });

  if (!logoUrl || !logoUrl.trim()) {
    return qrBuffer;
  }

  const logoBuffer = await fetchLogoBuffer(logoUrl.trim());
  if (!logoBuffer) {
    return qrBuffer;
  }

  try {
    const logoSize = Math.floor(size * 0.22); // 22% size in center
    const pad = Math.floor(logoSize * 0.15);
    const boxSize = logoSize + (pad * 2);

    // Create a white rounded rectangle background for the logo
    const rectSvg = Buffer.from(
      `<svg width="${boxSize}" height="${boxSize}">
        <rect x="0" y="0" width="${boxSize}" height="${boxSize}" rx="12" ry="12" fill="#ffffff" />
      </svg>`
    );

    // Resize the logo to fit the center
    const resizedLogo = await sharp(logoBuffer)
      .resize(logoSize, logoSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toBuffer();

    // Composite the background and the logo over the QR code
    return await sharp(qrBuffer)
      .composite([
        { input: rectSvg, gravity: 'center' },
        { input: resizedLogo, gravity: 'center' }
      ])
      .png()
      .toBuffer();
  } catch (err) {
    console.error('Failed to composite QR code with logo:', err);
    return qrBuffer; // Fallback to base QR
  }
}
