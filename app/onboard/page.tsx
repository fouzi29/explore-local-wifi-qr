'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Wifi, Sparkles, Check, ArrowRight, Mail, Building2, Download, Printer, ExternalLink, CheckCircle2, Palette, Image as ImageIcon, Upload, Link2 } from 'lucide-react';
import { VenueSettings, saveVenueSettings } from '@/lib/storage';
import { encodeVenueParams } from '@/lib/wifi';
import { generateStyledQrCode } from '@/lib/qr';

const BRAND_COLORS = [
  { name: 'Emerald Green', hex: '#16a34a' },
  { name: 'Sapphire Blue', hex: '#2563eb' },
  { name: 'Amber Gold', hex: '#d97706' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Violet Purple', hex: '#7c3aed' },
  { name: 'Midnight Slate', hex: '#0f172a' },
];

export default function OnboardPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [venueName, setVenueName] = useState('');
  const [tagline, setTagline] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoMode, setLogoMode] = useState<'upload' | 'link'>('upload');
  const [accentColor, setAccentColor] = useState('#16a34a');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState<'WPA2' | 'WPA' | 'WEP' | 'nopass'>('WPA2');
  const [notifyEmail, setNotifyEmail] = useState('');

  // Created Venue State (For Success Screen)
  const [createdVenue, setCreatedVenue] = useState<VenueSettings | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // File Upload to Base64 Data URL Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Logo image file must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setLogoUrl(event.target.result as string);
        setError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCompleteSetup = async () => {
    if (!notifyEmail.trim()) {
      setError('Please enter a valid notification email address to receive your QR Stand.');
      return;
    }
    if (!venueName.trim() || !ssid.trim() || !password.trim() || !notifyEmail.trim()) {
      setError('Please fill in required Venue Name, Wi-Fi SSID, Password, and Email Address.');
      return;
    }

    setLoading(true);
    const newVenueId = 'venue_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const slug = venueName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const safeColor = (accentColor && accentColor.trim()) ? accentColor.trim() : '#16a34a';

    const newVenueSettings: VenueSettings = {
      id: newVenueId,
      name: venueName.trim(),
      slug,
      tagline: tagline.trim() || 'Free Guest Wi-Fi & Local Recommendations',
      welcomeMessage: `Connect to High-Speed Wi-Fi at ${venueName.trim()}`,
      accentColor: safeColor,
      logoUrl: logoUrl.trim() || undefined,
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

      const { s, p, e, l } = encodeVenueParams(ssid.trim(), password.trim(), notifyEmail.trim(), logoUrl.trim());
      const portalUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/v/${slug}?s=${encodeURIComponent(s)}&p=${encodeURIComponent(p)}&e=${encodeURIComponent(e)}&l=${encodeURIComponent(l)}`
        : `https://explore-local-wifi-qr.vercel.app/v/${slug}?s=${encodeURIComponent(s)}&p=${encodeURIComponent(p)}&e=${encodeURIComponent(e)}&l=${encodeURIComponent(l)}`;

      const dataUrl = await generateStyledQrCode(portalUrl, logoUrl.trim() || undefined, safeColor, 400);
      setQrDataUrl(dataUrl);
      setCreatedVenue(newVenueSettings);
      setStep(4);
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

        {/* STEP 1: VENUE DETAILS, DUAL LOGO OPTION (UPLOAD / LINK) & COLOR CODE */}
        {step === 1 && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Business Information & Logo</h3>
                <p className="text-xs text-slate-400">Upload your logo file or paste an image link (Optional).</p>
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
                Tagline or Subtitle (Optional)
              </label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="e.g. Artisanal Roasts & Fresh Bakery"
                className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* DUAL LOGO OPTION: DIRECT UPLOAD OR IMAGE LINK */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" /> Venue Logo (Optional)
                </label>

                {/* Mode Selector Tabs */}
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setLogoMode('upload')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                      logoMode === 'upload' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Upload className="w-3 h-3" /> Upload File
                  </button>

                  <button
                    type="button"
                    onClick={() => setLogoMode('link')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                      logoMode === 'link' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Link2 className="w-3 h-3" /> Image Link
                  </button>
                </div>
              </div>

              {/* Mode A: Direct File Upload */}
              {logoMode === 'upload' ? (
                <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 text-center cursor-pointer transition-all bg-slate-900/40">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="logo-file-input"
                  />
                  <label htmlFor="logo-file-input" className="cursor-pointer flex flex-col items-center gap-1.5">
                    <Upload className="w-6 h-6 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-300">Click to Upload Logo Image File</span>
                    <span className="text-[10px] text-slate-500">Supports PNG, JPG, WEBP (Max 2MB)</span>
                  </label>
                </div>
              ) : (
                /* Mode B: Image Link URL */
                <input
                  type="url"
                  value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/my-logo.png"
                  className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm font-mono placeholder-slate-500 focus:outline-none"
                />
              )}

              {/* FULL-SIZE LOGO PREVIEW */}
              {logoUrl && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-semibold">Full Logo Size Preview:</span>
                    <img
                      src={logoUrl}
                      alt="Logo Preview"
                      className="max-h-16 max-w-[200px] object-contain rounded-md"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setLogoUrl('')}
                    className="text-xs text-slate-500 hover:text-red-400 font-bold"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Optional QR Code Color Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-emerald-400" /> QR Code Color Code (Optional)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {BRAND_COLORS.map(c => (
                  <button
                    type="button"
                    key={c.hex}
                    onClick={() => setAccentColor(c.hex)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      accentColor === c.hex
                        ? 'border-white bg-slate-800 shadow-md ring-2 ring-emerald-500/50'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: c.hex }}></div>
                    <span className="text-[10px] text-slate-300 font-medium truncate w-full text-center">{c.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Custom Hex Code (Optional):</span>
                <input
                  type="text"
                  placeholder="#16a34a"
                  value={accentColor}
                  onChange={e => setAccentColor(e.target.value)}
                  className="w-28 px-3 py-1.5 rounded-lg glass-input text-white text-xs font-mono"
                />
              </div>
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
              ⚡ <strong>Instant Delivery:</strong> Your styled QR code & portal instructions will be sent automatically to this email address!
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

        {/* STEP 4: REGISTRATION SUCCESS & FULL LOGO SIZE DISPLAY SCREEN */}
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
                We have emailed your portal links and styled QR code to <strong className="text-emerald-400">{notifyEmail}</strong>. Below is your official printable tabletop stand!
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

            {/* Printable Acrylic Stand with FULL-SIZE LOGO DISPLAY */}
            <div className="flex justify-center my-6 overflow-hidden px-2">
              <div
                id="printable-stand"
                className="w-full max-w-sm sm:max-w-md bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-slate-100 text-center flex flex-col items-center justify-between min-h-[520px] sm:min-h-[580px] relative overflow-hidden"
              >
                {/* Decorative Header with FULL LOGO SIZE */}
                <div className="w-full bg-slate-950 text-white py-4 px-6 rounded-2xl mb-4 shadow-md flex flex-col items-center justify-center gap-2">
                  {createdVenue.logoUrl ? (
                    <img
                      src={createdVenue.logoUrl}
                      alt={createdVenue.name}
                      className="max-h-16 max-w-[220px] object-contain mb-1"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-1">
                      <Wifi className="w-7 h-7" />
                    </div>
                  )}
                  <div className="text-center">
                    <span className="font-extrabold tracking-tight text-lg uppercase block">{createdVenue.name}</span>
                    <p className="text-xs text-emerald-400 font-semibold">{createdVenue.tagline || 'Guest Wi-Fi Access'}</p>
                  </div>
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
                    <div className="relative inline-block">
                      <img src={qrDataUrl} alt="Tabletop QR Stand" className="w-52 h-52 rounded-lg" />
                      {createdVenue.logoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-md border border-slate-200 flex items-center justify-center">
                            <img src={createdVenue.logoUrl} alt={createdVenue.name} className="w-full h-full object-contain rounded-lg" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-52 h-52 bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                      Generating QR...
                    </div>
                  )}
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Sparkles className="w-3.5 h-3.5" style={{ color: createdVenue.accentColor || '#16a34a' }} /> Point Camera to Scan
                  </div>
                </div>

                {/* Steps */}
                <div className="w-full border-t border-slate-200 pt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold text-slate-600">
                  <div>
                    <span className="block font-extrabold text-xs" style={{ color: createdVenue.accentColor || '#16a34a' }}>1. SCAN</span>
                    <span>Open Camera</span>
                  </div>
                  <div>
                    <span className="block font-extrabold text-xs" style={{ color: createdVenue.accentColor || '#16a34a' }}>2. ENTER</span>
                    <span>Quick Info</span>
                  </div>
                  <div>
                    <span className="block font-extrabold text-xs" style={{ color: createdVenue.accentColor || '#16a34a' }}>3. CONNECT</span>
                    <span>Get Wi-Fi</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
