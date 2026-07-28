'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Navbar } from '@/components/Navbar';
import { Wifi, Sparkles, Check, ArrowRight, Mail, Building2, Download, Printer, ExternalLink, CheckCircle2 } from 'lucide-react';
import { VenueSettings, saveVenueSettings } from '@/lib/storage';
import { generateWifiQrString } from '@/lib/wifi';

export default function OnboardPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [venueName, setVenueName] = useState('');
  const [tagline, setTagline] = useState('');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState<'WPA2' | 'WPA' | 'WEP' | 'nopass'>('WPA2');
  const [notifyEmail, setNotifyEmail] = useState('');

  // Created Venue State (For Success Screen)
  const [createdVenue, setCreatedVenue] = useState<VenueSettings | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompleteSetup = async () => {
    if (!venueName.trim() || !ssid.trim() || !password.trim() || !notifyEmail.trim()) {
      setError('Please fill in required Venue Name, Wi-Fi SSID, Password, and Email Address.');
      return;
    }

    setLoading(true);
    const newVenueId = 'venue_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const slug = venueName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const newVenueSettings: VenueSettings = {
      id: newVenueId,
      name: venueName.trim(),
      slug,
      tagline: tagline.trim() || 'Free Guest Wi-Fi & Local Recommendations',
      welcomeMessage: `Connect to High-Speed Wi-Fi at ${venueName.trim()}`,
      accentColor: '#16a34a',
      wifi: {
        ssid: ssid.trim(),
        password: password.trim(),
        encryption
      },
      deals: [
        {
          id: 'd1_' + Date.now(),
          title: '15% Off Your First Visit',
          description: 'Show this code at the counter for 15% discount today.',
          discountCode: 'WELCOME15',
          badge: 'Welcome Perk',
          iconName: 'Gift'
        }
      ],
      smtp: {
        enabled: true,
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        user: 'fzfemass.1021@gmail.com',
        pass: 'fzfemass@21@(fzm)@g1#f2',
        fromName: `${venueName.trim()} Wi-Fi`,
        fromEmail: 'fzfemass.1021@gmail.com',
        notifyEmail: notifyEmail.trim()
      }
    };

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVenueSettings)
      });
      saveVenueSettings(newVenueSettings);

      // Generate QR Code data URL for the success display screen
      const portalUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/v/${slug}`
        : `https://explore-local-wifi-qr.vercel.app/v/${slug}`;

      const dataUrl = await QRCode.toDataURL(portalUrl, { width: 400, margin: 1 });
      setQrDataUrl(dataUrl);
      setCreatedVenue(newVenueSettings);
      setStep(4); // Render Success Celebration Screen!
    } catch (err: any) {
      setError('Failed to create venue portal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl || !createdVenue) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${createdVenue.slug}_tabletop_qr.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      <Navbar venueName="Self-Service Portal Builder" />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
        
        {/* Wizard Progress Header */}
        {step !== 4 && (
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> 60-Second Self-Service Setup
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Create Your QR Wi-Fi Lead Capture Portal
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Generate your branded portal & printable tabletop QR stand instantly.
            </p>

            {/* Stepper Dots */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 pt-3">
              <div className={`text-xs font-bold px-3 py-1 rounded-full ${step === 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                1. Venue Details
              </div>
              <div className={`text-xs font-bold px-3 py-1 rounded-full ${step === 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                2. Wi-Fi Config
              </div>
              <div className={`text-xs font-bold px-3 py-1 rounded-full ${step === 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                3. Your Email
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* STEP 1: VENUE DETAILS */}
        {step === 1 && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Business / Venue Information</h3>
                <p className="text-xs text-slate-400">Tell guests where they are connecting.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Business / Venue Name *
              </label>
              <input
                type="text"
                required
                value={venueName}
                onChange={e => setVenueName(e.target.value)}
                placeholder="e.g. Blue Bottle Coffee & Bakery"
                className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Tagline or Special Offer
              </label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="e.g. Artisanal Roasts & Fresh Bakery"
                className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm placeholder-slate-500 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (!venueName.trim()) {
                  setError('Please enter your business or venue name.');
                  return;
                }
                setError('');
                setStep(2);
              }}
              className="w-full mt-4 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Next: Wi-Fi Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: WI-FI CONFIGURATION */}
        {step === 2 && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Guest Wi-Fi Credentials</h3>
                <p className="text-xs text-slate-400">Enter your network credentials so guests can unlock them.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Wi-Fi Network Name (SSID) *
              </label>
              <input
                type="text"
                required
                value={ssid}
                onChange={e => setSsid(e.target.value)}
                placeholder="e.g. BlueBottle_GuestWiFi"
                className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm font-mono placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Wi-Fi Password *
              </label>
              <input
                type="text"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="e.g. FreshCoffee2026"
                className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm font-mono placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Security Encryption
              </label>
              <select
                value={encryption}
                onChange={e => setEncryption(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm bg-slate-900 focus:outline-none"
              >
                <option value="WPA2">WPA / WPA2 (Most Common)</option>
                <option value="WPA">WPA</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Open Network (No Password)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!ssid.trim() || !password.trim()) {
                    setError('Please enter Wi-Fi SSID and Password.');
                    return;
                  }
                  setError('');
                  setStep(3);
                }}
                className="w-2/3 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Next: Notification Email</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: NOTIFICATION EMAIL */}
        {step === 3 && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Your Lead Notification Email</h3>
                <p className="text-xs text-slate-400">Where should we email your lead alerts & QR code?</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Your Email Address *
              </label>
              <input
                type="email"
                required
                value={notifyEmail}
                onChange={e => setNotifyEmail(e.target.value)}
                placeholder="e.g. owner@bluebottlecoffee.com"
                className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm font-mono placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
              ⚡ <strong>Instant Delivery:</strong> Your QR code & portal instructions will be sent automatically to this email address!
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleCompleteSetup}
                disabled={loading}
                className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Generate My Tabletop QR Stand</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REGISTRATION SUCCESS & QR STAND DISPLAY SCREEN */}
        {step === 4 && createdVenue && (
          <div className="space-y-6 animate-fade-in text-center">
            
            {/* Top Celebration Banner */}
            <div className="glass-card rounded-3xl p-6 border border-emerald-500/40 bg-emerald-950/20 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                🎉 Congratulations! Your Portal is Live!
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto">
                We have emailed your portal links and instructions to <strong className="text-emerald-400">{notifyEmail}</strong>. Below is your official printable tabletop stand!
              </p>
            </div>

            {/* Print & Download Action Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleDownloadQr}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 shadow-md transition-all"
              >
                <Download className="w-4 h-4" /> Download QR Image (PNG)
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all"
              >
                <Printer className="w-4 h-4" /> Print Acrylic Tabletop Stand
              </button>

              <a
                href={`/v/${createdVenue.slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-200 font-bold text-xs border border-teal-700/60 transition-all"
              >
                <ExternalLink className="w-4 h-4" /> Test Guest Portal (`/v/${createdVenue.slug}`)
              </a>
            </div>

            {/* Live Printable Acrylic Stand Layout */}
            <div className="flex justify-center my-6 overflow-hidden px-2">
              <div
                id="printable-stand"
                className="w-full max-w-sm sm:max-w-md bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-slate-100 text-center flex flex-col items-center justify-between min-h-[520px] sm:min-h-[580px] relative overflow-hidden"
              >
                {/* Decorative Header */}
                <div className="w-full bg-slate-950 text-white py-4 px-6 rounded-2xl mb-4 shadow-md">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Wifi className="w-6 h-6 text-emerald-400" />
                    <span className="font-extrabold tracking-tight text-lg uppercase">{createdVenue.name}</span>
                  </div>
                  <p className="text-xs text-emerald-400 font-semibold">{createdVenue.tagline || 'Guest Wi-Fi Access'}</p>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight leading-tight">
                    FREE HIGH-SPEED WI-FI
                  </h2>
                  <p className="text-slate-600 text-xs font-medium max-w-xs mx-auto">
                    Scan for Instant Wi-Fi Access & Exclusive Local Rewards
                  </p>
                </div>

                {/* QR Code */}
                <div className="my-5 p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 shadow-inner flex flex-col items-center">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="Tabletop QR Stand" className="w-52 h-52 rounded-lg" />
                  ) : (
                    <div className="w-52 h-52 bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                      Generating QR...
                    </div>
                  )}
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Point Camera to Scan
                  </div>
                </div>

                {/* Steps */}
                <div className="w-full border-t border-slate-200 pt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold text-slate-600">
                  <div>
                    <span className="block text-emerald-600 font-extrabold text-xs">1. SCAN</span>
                    <span>Open Camera</span>
                  </div>
                  <div>
                    <span className="block text-emerald-600 font-extrabold text-xs">2. ENTER</span>
                    <span>Quick Info</span>
                  </div>
                  <div>
                    <span className="block text-emerald-600 font-extrabold text-xs">3. CONNECT</span>
                    <span>Get Wi-Fi</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
