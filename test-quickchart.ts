async function test() {
  const portalUrl = 'https://explore-local-wifi-qr.vercel.app/v/test';
  const logoUrl = 'https://explore-local-wifi-qr.vercel.app/favicon.ico';
  const accentColor = '16a34a'; // Without hash

  let url = `https://quickchart.io/qr?text=${encodeURIComponent(portalUrl)}&size=500&margin=1&dark=${accentColor}`;
  if (logoUrl) {
    url += `&centerImageUrl=${encodeURIComponent(logoUrl)}`;
  }

  console.log('Fetching:', url);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = await res.arrayBuffer();
    console.log('Got buffer of size:', buffer.byteLength);
  } catch (err) {
    console.error('Error:', err);
  }
}
test();
