'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Printer, Download, QrCode, Sparkles, Wifi, ShieldCheck, ExternalLink } from 'lucide-react';
import { VenueSettings } from '@/lib/storage';
import { generateWifiQrString, encodeWifiParams } from '@/lib/wifi';
import { generateStyledQrCode } from '@/lib/qr';

interface AdminQrStudioProps {
  settings: VenueSettings;
}

export const AdminQrStudio: React.FC<AdminQrStudioProps> = ({ settings }) => {
  const [qrType, setQrType] = useState<'portal' | 'wifi'>('portal');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [standTitle, setStandTitle] = useState('FREE HIGH-SPEED WI-FI');
  const [standSubtitle, setStandSubtitle] = useState('Scan for Instant Access & Exclusive Local Deals');

  // Compute portal target URL
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://explorelocal.vercel.app';
    
  const portalUrl = `${baseUrl}/?venueId=${settings.id}`;

  const wifiString = generateWifiQrString(settings.wifi);
  const { s, p } = encodeWifiParams(settings.wifi.ssid, settings.wifi.password);
  const targetContent = qrType === 'portal' 
    ? `${baseUrl}/v/${settings.slug}?s=${encodeURIComponent(s)}&p=${encodeURIComponent(p)}` 
    : wifiString;

  useEffect(() => {
    generateStyledQrCode(targetContent, settings.logoUrl, settings.accentColor || '#16a34a', 400)
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to render QR', err));
  }, [targetContent, settings.logoUrl, settings.accentColor]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${settings.slug}_qr_code.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Configuration Header */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-400" />
              <span>Tabletop QR Code & Print Studio</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Generate print-ready QR codes for acrylic stands, tabletop tents, or counter displays.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadQr}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Download PNG
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
            >
              <Printer className="w-3.5 h-3.5" /> Print Tabletop Stand
            </button>
          </div>
        </div>

        {/* QR Mode Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          <button
            onClick={() => setQrType('portal')}
            className={`p-4 rounded-xl border text-left transition-all ${
              qrType === 'portal'
                ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-sm mb-1">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Lead Capture Portal QR (Recommended)
              </span>
              {qrType === 'portal' && <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-extrabold">Active</span>}
            </div>
            <p className="text-xs text-slate-400">
              Scans open your branded mobile landing page, collects name & email, then unlocks Wi-Fi & local deals.
            </p>
          </button>

          <button
            onClick={() => setQrType('wifi')}
            className={`p-4 rounded-xl border text-left transition-all ${
              qrType === 'wifi'
                ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-sm mb-1">
              <span className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-teal-400" /> Direct Camera Wi-Fi Connect QR
              </span>
              {qrType === 'wifi' && <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-extrabold">Active</span>}
            </div>
            <p className="text-xs text-slate-400">
              Scans directly connect the guest's phone to your Wi-Fi SSID ({settings.wifi.ssid}) without asking for details.
            </p>
          </button>

        </div>

        {/* Customization Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Stand Headline
            </label>
            <input
              type="text"
              value={standTitle}
              onChange={e => setStandTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-white text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Stand Subtitle
            </label>
            <input
              type="text"
              value={standSubtitle}
              onChange={e => setStandSubtitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-white text-xs"
            />
          </div>
        </div>

      </div>

      {/* Live Tabletop Stand Preview Card */}
      <div className="flex justify-center my-4 overflow-hidden px-2">
        
        <div
          id="printable-stand"
          className="w-full max-w-sm sm:max-w-md bg-white text-slate-900 rounded-3xl p-5 sm:p-8 shadow-2xl border-4 border-slate-100 text-center flex flex-col items-center justify-between min-h-[520px] sm:min-h-[580px] relative overflow-hidden"
        >
                {/* Decorative Top Arch */}
                <div className="w-full bg-slate-950 text-white py-4 px-6 rounded-2xl mb-6 shadow-md flex flex-col items-center justify-center gap-2">
                  {settings.logoUrl ? (
                    <img
                      src={settings.logoUrl}
                      alt={settings.name}
                      className="max-h-16 max-w-[220px] object-contain mb-1"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-1">
                      <Wifi className="w-7 h-7" />
                    </div>
                  )}
                  <div className="text-center">
                    <span className="font-extrabold tracking-tight text-lg uppercase block">{settings.name}</span>
                    <p className="text-xs text-emerald-400 font-semibold">{settings.tagline || 'Guest Wi-Fi Access'}</p>
                  </div>
                </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight leading-tight">
              {standTitle}
            </h2>
            <p className="text-slate-600 text-xs font-medium max-w-xs mx-auto">
              {standSubtitle}
            </p>
          </div>

          {/* Large QR Code Display */}
          <div className="my-6 p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 shadow-inner flex flex-col items-center">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Printable QR Stand" className="w-56 h-56 rounded-lg" />
            ) : (
              <div className="w-56 h-56 bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                Generating QR...
              </div>
            )}
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Point Smartphone Camera to Scan
            </div>
          </div>

          {/* Easy Steps Footer */}
          <div className="w-full border-t border-slate-200 pt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold text-slate-600">
            <div>
              <span className="block text-emerald-600 font-extrabold text-xs">1. SCAN</span>
              <span>Open Phone Camera</span>
            </div>
            <div>
              <span className="block text-emerald-600 font-extrabold text-xs">2. ENTER</span>
              <span>Quick 10s Lead Info</span>
            </div>
            <div>
              <span className="block text-emerald-600 font-extrabold text-xs">3. CONNECT</span>
              <span>Get High-Speed Wi-Fi</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
