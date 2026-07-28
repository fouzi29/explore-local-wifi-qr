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
 * Base64 helper for encoding SSID and Password in Tabletop QR URLs
 */
export function encodeWifiParams(ssid: string, password: string): { s: string; p: string } {
  try {
    const s = typeof window !== 'undefined' ? btoa(encodeURIComponent(ssid)) : Buffer.from(ssid).toString('base64');
    const p = typeof window !== 'undefined' ? btoa(encodeURIComponent(password)) : Buffer.from(password).toString('base64');
    return { s, p };
  } catch (e) {
    return { s: encodeURIComponent(ssid), p: encodeURIComponent(password) };
  }
}

export function decodeWifiParams(sParam: string, pParam: string): { ssid: string; password: string } | null {
  if (!sParam || !pParam) return null;
  try {
    const ssid = typeof window !== 'undefined' ? decodeURIComponent(atob(sParam)) : Buffer.from(sParam, 'base64').toString('utf-8');
    const password = typeof window !== 'undefined' ? decodeURIComponent(atob(pParam)) : Buffer.from(pParam, 'base64').toString('utf-8');
    return { ssid, password };
  } catch (e) {
    return { ssid: decodeURIComponent(sParam), password: decodeURIComponent(pParam) };
  }
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
