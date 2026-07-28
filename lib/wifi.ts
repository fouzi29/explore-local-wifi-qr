export interface WifiConfig {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WPA2' | 'WEP' | 'nopass';
  hidden?: boolean;
}

export function generateWifiQrString(config: WifiConfig): string {
  const { ssid, password, encryption, hidden = false } = config;
  if (encryption === 'nopass' || !password) {
    return `WIFI:S:${escapeWifiField(ssid)};T:nopass;;`;
  }
  return `WIFI:S:${escapeWifiField(ssid)};T:${encryption};P:${escapeWifiField(password)};${hidden ? 'H:true;' : ''};`;
}

function escapeWifiField(str: string): string {
  return str.replace(/([\\;:,"])/g, '\\$1');
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
