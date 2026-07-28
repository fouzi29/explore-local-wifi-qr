import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Explore Local - QR Wi-Fi Lead Capture & Local Guide",
  description: "Connect to high-speed venue Wi-Fi and unlock exclusive local rewards, discounts, and neighborhood recommendations.",
  keywords: ["QR Wi-Fi", "Wi-Fi Lead Capture", "Local Guide", "Venue Marketing", "Café Wi-Fi", "Guest Wi-Fi"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
