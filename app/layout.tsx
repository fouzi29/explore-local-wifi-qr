import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "WiFiPulse - Turn Free Guest Wi-Fi Into Customer Leads",
  description: "The #1 B2B QR Wi-Fi Lead Capture SaaS for restaurants, cafes, and local venues. Collect customer contact details & build your database on autopilot.",
  keywords: ["WiFiPulse", "QR Wi-Fi", "Wi-Fi Lead Capture", "Restaurant Marketing", "Café Wi-Fi", "Guest Wi-Fi SaaS"],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#090d16',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
