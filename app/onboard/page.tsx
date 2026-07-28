'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Wifi, Sparkles, Check, ArrowRight, ShieldCheck, Mail, Building2, Lock } from 'lucide-react';
import { VenueSettings, saveVenueSettings } from '@/lib/storage';

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [venueName, setVenueName] = useState('');
  const [tagline, setTagline] = useState('');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState<'WPA2' | 'WPA' | 'WEP' | 'nopass'>('WPA2');

  // Optional SMTP Email Server Setup State
  const [enableSmtp, setEnableSmtp] = useState(false);
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [notifyEmail, setNotifyEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompleteSetup = async () => {
    if (!venueName.trim() || !ssid.trim() || !password.trim()) {
      setError('Please fill in required Venue Name, Wi-Fi SSID, and Password.');
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
        enabled: enableSmtp,
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        user: smtpUser,
        pass: smtpPass,
        fromName: `${venueName.trim()} Wi-Fi Portal`,
        fromEmail: smtpUser,
        notifyEmail: notifyEmail || smtpUser
      }
    };

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVenueSettings)
      });
      saveVenueSettings(newVenueSettings);
      router.push(`/admin?venueId=${newVenueId}`);
    } catch (err: any) {
      setError('Failed to create venue portal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      <Navbar venueName="Self-Service Portal Builder" />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-10">
        
        {/* Wizard Progress Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> 60-Second Self-Service Setup
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Create Your QR Wi-Fi Lead Capture Portal
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Zero coding or developer required. Generate your branded portal & printable tabletop QR stand instantly.
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full ${step === 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              1. Venue Details
            </div>
            <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full ${step === 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              2. Wi-Fi Config
            </div>
            <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full ${step === 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              3. Email Alerts (Optional)
            </div>
          </div>
        </div>

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
                <span>Next: Email Alerts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: OPTIONAL SMTP EMAIL ALERTS */}
        {step === 3 && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Instant Email Alerts (Optional)</h3>
                  <p className="text-xs text-slate-400">Get an email whenever a guest captures lead info.</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableSmtp}
                  onChange={e => setEnableSmtp(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {enableSmtp && (
              <div className="space-y-4 pt-1 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    SMTP Server Host
                  </label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={e => setSmtpHost(e.target.value)}
                    placeholder="smtp.gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      SMTP User / Email
                    </label>
                    <input
                      type="text"
                      value={smtpUser}
                      onChange={e => setSmtpUser(e.target.value)}
                      placeholder="you@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      SMTP App Password
                    </label>
                    <input
                      type="password"
                      value={smtpPass}
                      onChange={e => setSmtpPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Recipient Notification Email
                  </label>
                  <input
                    type="email"
                    value={notifyEmail}
                    onChange={e => setNotifyEmail(e.target.value)}
                    placeholder="owner@myvenue.com"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs font-mono"
                  />
                </div>
              </div>
            )}

            {!enableSmtp && (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                ℹ️ <strong>Optional feature:</strong> You can skip email alerts now and configure them later anytime in your Admin Settings. Leads will still be saved securely in your Lead Table & CSV exports.
              </div>
            )}

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
                    <span>Launch Portal & Print Stand</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
