'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, Zap, Building } from 'lucide-react';

export const SaaSPricing: React.FC = () => {
  return (
    <section className="py-16 border-t border-slate-900">
      <div className="max-w-5xl mx-auto px-4 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" /> Simple Transparent SaaS Pricing
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Flexible Plans for Any Restaurant or Venue
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Start free today. Upgrade anytime as your guest Wi-Fi lead database grows.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* STARTER (Free) */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Starter Plan</span>
              <div className="text-3xl font-extrabold text-white mt-2">$0 <span className="text-xs font-normal text-slate-400">/ forever</span></div>
              <p className="text-xs text-slate-400 mt-1">Perfect for single cafes & small local shops.</p>
              
              <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> 1 Venue Location
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Up to 100 Lead Captures / mo
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Wi-Fi Auto-Connect QR Generator
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Printable Tabletop Stand Template
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> CSV Data Export
                </li>
              </ul>
            </div>

            <Link
              href="/onboard"
              className="mt-8 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-all block"
            >
              Get Started Free
            </Link>
          </div>

          {/* PRO VENUE ($29/mo) - Featured */}
          <div className="glass-card rounded-3xl p-6 border-2 border-emerald-500/60 bg-slate-900/90 flex flex-col justify-between relative shadow-xl shadow-emerald-500/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              Most Popular
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Pro Venue</span>
              <div className="text-3xl font-extrabold text-white mt-2">$29 <span className="text-xs font-normal text-slate-400">/ month</span></div>
              <p className="text-xs text-slate-400 mt-1">For busy restaurants, bars & popular venues.</p>
              
              <ul className="mt-6 space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Unlimited Lead Captures
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Custom SMTP Email Outgoing Server
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Automated Real-time Owner Alerts
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Custom Venue Logo & Accent Colors
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Unlocked Local Deals Manager
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Priority Support
                </li>
              </ul>
            </div>

            <Link
              href="/onboard"
              className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs text-center shadow-lg shadow-emerald-500/20 transition-all block"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* AGENCY ($79/mo) */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Agency / Multi-Location</span>
              <div className="text-3xl font-extrabold text-white mt-2">$79 <span className="text-xs font-normal text-slate-400">/ month</span></div>
              <p className="text-xs text-slate-400 mt-1">For restaurant chains & marketing agencies.</p>
              
              <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" /> Up to 10 Venue Locations
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" /> Multi-Tenant Master Creator Dashboard
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" /> White-label Domain Options
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" /> Multi-User Admin Permission Roles
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" /> Webhook & Zapier Integration
                </li>
              </ul>
            </div>

            <Link
              href="/onboard"
              className="mt-8 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-all block"
            >
              Contact Agency Sales
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
