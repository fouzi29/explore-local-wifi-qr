'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Wifi, Copy, Check, QrCode, Shield, Smartphone } from 'lucide-react';
import { VenueSettings } from '@/lib/storage';
import { generateWifiQrString } from '@/lib/wifi';

interface WifiCardProps {
  settings: VenueSettings;
  guestName: string;
}

export const WifiCard: React.FC<WifiCardProps> = ({ settings, guestName }) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const wifiConfig = settings.wifi;
  const wifiQrString = generateWifiQrString(wifiConfig);

  useEffect(() => {
    QRCode.toDataURL(wifiQrString, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate Wi-Fi QR code', err));
  }, [wifiQrString]);

  const copyPassword = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(wifiConfig.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-2xl relative overflow-hidden animate-float">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Wifi className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Wi-Fi Access Unlocked</span>
            <h3 className="text-xl font-extrabold text-white">Welcome, {guestName}!</h3>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800">
          <Shield className="w-3.5 h-3.5 text-emerald-400" /> WPA2 Secure
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Credentials & Copy Action */}
        <div className="space-y-4">
          
          {/* SSID */}
          <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Network Name (SSID)</span>
            <div className="text-lg font-bold text-white mt-0.5 flex items-center justify-between">
              <span>{wifiConfig.ssid}</span>
              <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Active</span>
            </div>
          </div>

          {/* Password */}
          <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Wi-Fi Password</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-mono font-bold text-emerald-400 tracking-wide">
                {wifiConfig.password}
              </span>
              <button
                onClick={copyPassword}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Password
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Instant Camera Connect:</strong> Point your iOS or Android camera at the QR code to automatically join without typing password!
            </div>
          </div>

        </div>

        {/* QR Code Auto-Connect */}
        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white text-slate-900 shadow-xl border border-slate-200">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Auto-connect Wi-Fi QR Code" className="w-48 h-48 rounded-lg" />
          ) : (
            <div className="w-48 h-48 bg-slate-100 flex items-center justify-center rounded-lg text-slate-400 text-xs">
              Generating QR...
            </div>
          )}
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>Scan Camera to Connect Instantly</span>
          </div>
        </div>

      </div>

    </div>
  );
};
