import { sendVenueWelcomeEmail } from './lib/email';
import { getVenueSettings } from './lib/storage';

async function main() {
  const venue = {
    id: "venue_test",
    name: "Test Venue",
    slug: "test-venue",
    wifi: { ssid: "Test-WiFi", password: "test-password" },
    smtp: { notifyEmail: "test@example.com" },
    logoUrl: "https://explore-local-wifi-qr.vercel.app/favicon.ico"
  };

  console.log("Testing sendVenueWelcomeEmail...");
  try {
    const result = await sendVenueWelcomeEmail(venue as any);
    console.log("Result:", result);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
