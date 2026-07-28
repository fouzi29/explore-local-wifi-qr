'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { SaaSHero } from '@/components/SaaSHero';
import { SaaSDemoWidget } from '@/components/SaaSDemoWidget';
import { SaaSPricing } from '@/components/SaaSPricing';
import { Wifi, Sparkles, ArrowRight, ShieldCheck, Mail, Users, QrCode, Download, Database } from 'lucide-react';

export default function SaaSMainHomePage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar venueName="WiFiPulse SaaS" />

      {/* Main SaaS Sections */}
      <main className="flex-1">
        
        {/* 1. Hero Section */}
        <SaaSHero />

        {/* 2. Interactive Live Simulator */}
        <SaaSDemoWidget />

        {/* 3. Feature Highlights Grid */}
        <section className="py-16 border-t border-slate-900 bg-slate-950">
          <div className="max-w-5xl mx-auto px-4 space-y-12">
            
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Built For High-Growth Venues
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Everything You Need to Monetize Free Wi-Fi
              </h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto">
                No complex hardware changes required. Works with any standard Wi-Fi router.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-emerald-500/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Tabletop Stand Studio</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generate print-ready acrylic sign templates (`window.print()`) with business logo, QR code, and clear 3-step instructions for guests.
                </p>
              </div>

              <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-emerald-500/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Custom SMTP Alerts</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Optionally connect your business email server (Gmail, SendGrid, custom cPanel) to get instant email alerts whenever guests scan your QR code.
                </p>
              </div>

              <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-emerald-500/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">1-Click CRM CSV Export</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Export verified customer contact records, marketing consents, device types, and interest preferences directly into Mailchimp, Klaviyo, or Excel.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* 4. Pricing Plans */}
        <SaaSPricing />

        {/* 5. Bottom CTA Banner */}
        <section className="py-16 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-900">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Turn Wi-Fi Scanners Into Repeat Customers?
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Join hundreds of cafes, restaurants, & local venues capturing leads on autopilot.
            </p>
            <div>
              <Link
                href="/onboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-base shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Launch Your Venue Portal in 60s</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-300">WiFiPulse SaaS</span> © 2026 • Created by fouzi.cse@gmail.com
          </div>
          <div className="flex items-center gap-4">
            <Link href="/onboard" className="hover:text-slate-300 transition-colors">Create Venue</Link>
            <Link href="/admin" className="hover:text-slate-300 transition-colors">Admin Dashboard</Link>
            <Link href="/v/rustic-roaster" className="hover:text-slate-300 transition-colors">Live Demo</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
