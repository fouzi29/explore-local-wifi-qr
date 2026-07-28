'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Lock, Sparkles, CheckCircle2, User, Mail, Tag } from 'lucide-react';
import { CapturedLead } from '@/lib/storage';

interface LeadFormProps {
  venueId: string;
  venueName: string;
  onSuccess: (lead: CapturedLead) => void;
}

const INTEREST_OPTIONS = [
  '☕ Coffee Specials',
  '🏷️ Discounts',
  '🎨 Local Art',
  '🎶 Live Music',
  '🥐 Chef Specials'
];

export const LeadForm: React.FC<LeadFormProps> = ({ venueId, venueName, onSuccess }) => {
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([INTEREST_OPTIONS[0]]);
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!emailOrPhone.trim()) {
      setError('Please enter your email or phone number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      let deviceType = 'Mobile Web Scanner';
      if (/iPhone|iPad|iPod/i.test(userAgent)) deviceType = 'Apple iOS';
      else if (/Android/i.test(userAgent)) deviceType = 'Android Smartphone';
      else if (/Macintosh|Windows|Linux/i.test(userAgent)) deviceType = 'Desktop / Laptop';

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId,
          name: name.trim(),
          emailOrPhone: emailOrPhone.trim(),
          interests: selectedInterests,
          marketingConsent,
          deviceType
        })
      });

      const data = await response.json();

      if (data.success && data.lead) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        onSuccess(data.lead);
      } else {
        setError(data.error || 'Failed to unlock Wi-Fi. Please try again.');
      }
    } catch (err: any) {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
      
      {/* Top Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600"></div>

      <div className="text-center mb-5 sm:mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Quick 10-Second Access
        </div>
        <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
          Unlock Free Guest Wi-Fi
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Instant Wi-Fi credentials & local perks at <strong>{venueName}</strong>.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Guest Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Your Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-white text-base sm:text-sm placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Email or Phone */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Email or Mobile Phone
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={emailOrPhone}
              onChange={e => setEmailOrPhone(e.target.value)}
              placeholder="alex@example.com or +1 555-0192"
              className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-white text-base sm:text-sm placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Local Interests (Chips) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-emerald-400" /> Select Interests
          </label>
          <div className="flex flex-wrap gap-1.5">
            {INTEREST_OPTIONS.map(interest => {
              const active = selectedInterests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`text-xs font-medium px-3 py-2 rounded-xl border transition-all ${
                    active
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/10'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            id="marketingConsent"
            checked={marketingConsent}
            onChange={e => setMarketingConsent(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/30 accent-emerald-500 shrink-0"
          />
          <label htmlFor="marketingConsent" className="text-xs text-slate-400 leading-tight cursor-pointer select-none">
            Send me local offers & Wi-Fi updates from {venueName}. Unsubscribe anytime.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Unlock Wi-Fi & View Deals</span>
            </>
          )}
        </button>

      </form>

      <div className="mt-4 text-center">
        <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Instant Access • 256-Bit Secure
        </p>
      </div>

    </div>
  );
};
