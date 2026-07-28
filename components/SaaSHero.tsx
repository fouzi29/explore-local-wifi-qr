'use client';

import React from 'react';
import Link from 'next/link';
import { Wifi, Sparkles, ArrowRight, ShieldCheck, Users, BarChart3, QrCode } from 'lucide-react';

export const SaaSHero: React.FC = () => {
  return (
    <section className="relative pt-12 pb-16 overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold shadow-lg shadow-emerald-500/5 animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5" /> #1 QR Wi-Fi Lead Capture Platform for Restaurants & Cafes
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
          Turn Free Guest Wi-Fi Into Your <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
            Most Powerful Lead Machine
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
          Guests scan tabletop QR codes, enter basic details to get instant high-speed Wi-Fi, and unlock exclusive local rewards — while you build a profitable customer email & SMS database on autopilot.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/onboard"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-base shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
          >
            <span>Create Your Free Venue Portal</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/v/rustic-roaster"
            target="_blank"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span>Test Live Guest Demo</span>
          </Link>
        </div>

        {/* Trust Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-slate-900/80 max-w-4xl mx-auto text-left">
          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <span className="text-2xl font-black text-white font-mono">500+</span>
            <p className="text-xs text-slate-400 mt-0.5">Leads Captured / Month</p>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <span className="text-2xl font-black text-emerald-400 font-mono">60 Sec</span>
            <p className="text-xs text-slate-400 mt-0.5">Zero-Touch Setup</p>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <span className="text-2xl font-black text-white font-mono">88%</span>
            <p className="text-xs text-slate-400 mt-0.5">Wi-Fi Opt-in Rate</p>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <span className="text-2xl font-black text-teal-400 font-mono">100%</span>
            <p className="text-xs text-slate-400 mt-0.5">Vercel Ready & SMTP</p>
          </div>
        </div>

      </div>

    </section>
  );
};
