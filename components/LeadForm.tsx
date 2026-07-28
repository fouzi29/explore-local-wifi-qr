'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Lock, Sparkles, CheckCircle2, User, Mail } from 'lucide-react';
import { CapturedLead } from '@/lib/storage';

interface LeadFormProps {
  venueId: string;
  venueName: string;
  onSuccess: (lead: CapturedLead) => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ venueId, venueName, onSuccess }) => {
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
          interests: [],
          marketingConsent,
          deviceType
        })
      });

      const data = await response.json();

      if (data.success && data.lead) {
        // Trigger celebratory confetti effect
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (err) {
          // Fallback if confetti fails
        }

        onSuccess(data.lead);
      } else {
        setError(data.error || 'Failed to submit form. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Quick Guest Connect
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Unlock High-Speed Wi-Fi
        </h2>
        
        <p className="text-xs sm:text-sm text-slate-400">
          Enter your details below for instant Wi-Fi access at <strong className="text-slate-200">{venueName}</strong>.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name Input */}
        <div>
          <label htmlFor="guest-name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-400" /> Your Full Name *
          </label>
          <input
            id="guest-name"
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Alex Morgan"
            className="w-full px-4 py-3 rounded-xl glass-input text-white text-base sm:text-sm placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Email or Phone Input */}
        <div>
          <label htmlFor="guest-contact" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-emerald-400" /> Email Address or Phone *
          </label>
          <input
            id="guest-contact"
            type="text"
            required
            value={emailOrPhone}
            onChange={e => setEmailOrPhone(e.target.value)}
            placeholder="alex@example.com or (555) 019-2834"
            className="w-full px-4 py-3 rounded-xl glass-input text-white text-base sm:text-sm placeholder-slate-500 focus:outline-none font-mono"
          />
        </div>

        {/* Marketing Opt-in Checkbox */}
        <div className="flex items-start gap-3 pt-1">
          <input
            id="marketing-consent"
            type="checkbox"
            checked={marketingConsent}
            onChange={e => setMarketingConsent(e.target.checked)}
            className="mt-1 w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950"
          />
          <label htmlFor="marketing-consent" className="text-xs text-slate-400 leading-snug cursor-pointer select-none">
            I agree to receive local deals & recommendations from <strong className="text-slate-300">{venueName}</strong>.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 mt-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Connect to Wi-Fi & Unlock Deals</span>
            </>
          )}
        </button>

      </form>

      {/* Footer Guarantee */}
      <div className="mt-4 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        <span>Your information is protected & encrypted. No spam ever.</span>
      </div>

    </div>
  );
};
