import QRCode from 'qrcode';

/**
 * Generates a QR code data URL with an optional centered logo image
 */
export async function generateStyledQrCode(
  text: string,
  logoUrl?: string,
  accentColor: string = '#16a34a',
  size: number = 400
): Promise<string> {
  // Step 1: Generate base QR code Data URL
  const qrDataUrl = await QRCode.toDataURL(text, {
    width: size,
    margin: 1,
    color: {
      dark: accentColor || '#16a34a',
      light: '#ffffff'
    }
  });

  // If no logo provided or running server-side without DOM canvas, return base QR
  if (!logoUrl || typeof window === 'undefined') {
    return qrDataUrl;
  }

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve(qrDataUrl);

    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.onload = () => {
      // Draw QR image
      ctx.drawImage(qrImg, 0, 0, size, size);

      // Load logo image
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.onload = () => {
        const logoSize = Math.floor(size * 0.22); // 22% size in center
        const logoPos = Math.floor((size - logoSize) / 2);

        // Draw white rounded background padding behind center logo
        const pad = Math.floor(logoSize * 0.15);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(logoPos - pad, logoPos - pad, logoSize + (pad * 2), logoSize + (pad * 2), 10);
        } else {
          ctx.rect(logoPos - pad, logoPos - pad, logoSize + (pad * 2), logoSize + (pad * 2));
        }
        ctx.fill();

        // Draw center logo
        ctx.drawImage(logoImg, logoPos, logoPos, logoSize, logoSize);

        resolve(canvas.toDataURL('image/png'));
      };

      logoImg.onerror = () => resolve(qrDataUrl);
      logoImg.src = logoUrl;
    };

    qrImg.onerror = () => resolve(qrDataUrl);
    qrImg.src = qrDataUrl;
  });
}
