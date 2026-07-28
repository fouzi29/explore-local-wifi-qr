'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Wifi, Copy, Check, QrCode, Shield, Smartphone, Key } from 'lucide-react';
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

  const accentColor = settings.accentColor || '#16a34a';

  useEffect(() => {
    QRCode.toDataURL(wifiQrString, {
      width: 320,
      margin: 2,
      color: {
        dark: accentColor,
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate Wi-Fi QR code', err));
  }, [wifiQrString, accentColor]);

  const copyPassword = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(wifiConfig.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-emerald-500/40 shadow-2xl relative overflow-hidden space-y-6">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Wifi className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 uppercase tracking-wider block">Wi-Fi Unlocked</span>
            <h3 className="text-base sm:text-xl font-extrabold text-white leading-snug">Welcome, {guestName}!</h3>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800">
          <Shield className="w-3.5 h-3.5 text-emerald-400" /> WPA2 Secure Network
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
        
        {/* Left Column: Network & Credentials Card */}
        <div className="space-y-3 sm:space-y-4 flex flex-col justify-between">
          
          {/* SSID */}
          <div className="bg-slate-950/70 rounded-xl sm:rounded-2xl p-4 border border-slate-800">
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold tracking-wider block">Network Name (SSID)</span>
            <div className="text-base sm:text-lg font-bold text-white mt-1 flex items-center justify-between gap-2">
              <span className="truncate">{wifiConfig.ssid}</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">Connected</span>
            </div>
          </div>

          {/* Actual Wi-Fi Password Box */}
          <div className="bg-slate-950/70 rounded-xl sm:rounded-2xl p-4 border border-emerald-500/30 bg-emerald-950/10">
            <span className="text-[10px] sm:text-xs text-emerald-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <Key className="w-3.5 h-3.5" /> Actual Wi-Fi Password
            </span>
            <div className="flex items-center justify-between gap-2 mt-1.5">
              <span className="text-lg sm:text-2xl font-mono font-extrabold text-white tracking-wide break-all select-all">
                {wifiConfig.password}
              </span>
              <button
                onClick={copyPassword}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-all shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Password
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Instant Camera Connect Hint */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] sm:text-xs text-slate-300 flex items-start gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Auto-Connect:</strong> Scan the QR code with your mobile camera to join the network automatically!
            </div>
          </div>

        </div>

        {/* Right Column: QR Code with Actual Password Display Underneath */}
        <div className="flex flex-col items-center justify-between p-5 rounded-2xl bg-white text-slate-900 shadow-xl border border-slate-200 text-center">
          
          <div className="w-full flex flex-col items-center">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Auto-connect Wi-Fi QR Code" className="w-44 h-44 sm:w-52 sm:h-52 rounded-xl border border-slate-200 shadow-sm" />
            ) : (
              <div className="w-44 h-44 sm:w-52 sm:h-52 bg-slate-100 flex items-center justify-center rounded-xl text-slate-400 text-xs">
                Generating QR...
              </div>
            )}
            
            <div className="mt-3 flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Point Camera to Scan & Auto-Connect</span>
            </div>
          </div>

          {/* Actual Password Text directly under the QR code */}
          <div className="w-full mt-4 pt-3 border-t border-slate-200 bg-slate-50 p-2.5 rounded-xl text-center">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Wi-Fi Password:</div>
            <div className="text-sm sm:text-base font-mono font-extrabold text-slate-950 tracking-wider break-all mt-0.5 select-all">
              {wifiConfig.password}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
