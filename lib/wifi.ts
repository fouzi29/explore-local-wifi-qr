export interface WifiConfig {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WPA2' | 'WEP' | 'nopass';
  hidden?: boolean;
}

/**
 * Standard Wi-Fi QR Code string for direct camera scanning
 */
export function generateWifiQrString(config: WifiConfig): string {
  const { ssid, password, encryption, hidden = false } = config;
  if (encryption === 'nopass' || !password) {
    return `WIFI:S:${escapeWifiField(ssid)};T:nopass;;`;
  }
  const encType = (encryption === 'WPA2' || encryption === 'WPA') ? 'WPA' : encryption;
  const hFlag = hidden ? 'H:true;' : '';
  return `WIFI:S:${escapeWifiField(ssid)};T:${encType};P:${escapeWifiField(password)};${hFlag};`;
}

function escapeWifiField(str: string): string {
  return str.replace(/([\\;:,"])/g, '\\$1');
}

/**
 * Safe Base64 helpers for encoding SSID, Password, Owner Email, and Logo URL in Tabletop QR URLs
 */
export function encodeVenueParams(
  ssid: string,
  password: string,
  notifyEmail?: string,
  logoUrl?: string
): { s: string; p: string; e: string; l: string } {
  const safeBtoa = (str: string) => {
    if (!str) return '';
    try {
      return typeof window !== 'undefined' ? btoa(encodeURIComponent(str)) : Buffer.from(str).toString('base64');
    } catch (e) {
      return encodeURIComponent(str);
    }
  };

  return {
    s: safeBtoa(ssid),
    p: safeBtoa(password),
    e: safeBtoa(notifyEmail || ''),
    l: safeBtoa(logoUrl || '')
  };
}

export function decodeVenueParams(
  sParam?: string | null,
  pParam?: string | null,
  eParam?: string | null,
  lParam?: string | null
): { ssid: string; password: string; notifyEmail: string; logoUrl: string } {
  const safeAtob = (str?: string | null) => {
    if (!str) return '';
    try {
      return typeof window !== 'undefined' ? decodeURIComponent(atob(str)) : Buffer.from(str, 'base64').toString('utf-8');
    } catch (e) {
      return decodeURIComponent(str);
    }
  };

  return {
    ssid: safeAtob(sParam),
    password: safeAtob(pParam),
    notifyEmail: safeAtob(eParam),
    logoUrl: safeAtob(lParam)
  };
}

export function downloadCsv(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(header => {
        const val = row[header] === undefined || row[header] === null ? '' : String(row[header]);
        return `"${val.replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
