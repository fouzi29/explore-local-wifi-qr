async function run() {
  console.log('Testing Registration (Settings API)...');
  const resSettings = await fetch('http://localhost:3000/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: "venue_api_test",
      name: "API Test Venue",
      slug: "api-test",
      wifi: { ssid: "test", password: "test" },
      smtp: { notifyEmail: "test@example.com" },
      logoUrl: ""
    })
  });
  console.log('Settings API Status:', resSettings.status);
  console.log('Settings API Body:', await resSettings.json());

  console.log('\nTesting Lead Capture (Leads API)...');
  const resLeads = await fetch('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      venueId: "venue_api_test",
      name: "Guest Lead",
      emailOrPhone: "guest@example.com"
    })
  });
  console.log('Leads API Status:', resLeads.status);
  console.log('Leads API Body:', await resLeads.json());
}
run();
