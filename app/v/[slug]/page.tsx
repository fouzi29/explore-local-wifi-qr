'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { LeadForm } from '@/components/LeadForm';
import { WifiCard } from '@/components/WifiCard';
import { LocalDeals } from '@/components/LocalDeals';
import { Footer } from '@/components/Footer';
import { getVenueBySlug, VenueSettings, CapturedLead } from '@/lib/storage';
import { Wifi, ChevronRight, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function RestaurantSlugPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const [settings, setSettings] = useState<VenueSettings | null>(null);
  const [unlockedLead, setUnlockedLead] = useState<CapturedLead | null>(null);

  useEffect(() => {
    fetch(`/api/settings?venueId=${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        } else {
          setSettings(getVenueBySlug(slug));
        }
      })
      .catch(() => setSettings(getVenueBySlug(slug)));
  }, [slug]);

  if (!settings) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400 font-medium">Loading Guest Wi-Fi Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      
      <Navbar venueName={settings.name} venueId={settings.id} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Venue Hero Banner */}
        <div className="text-center space-y-3 relative py-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Wifi className="w-3.5 h-3.5 animate-pulse" /> Official Guest Wi-Fi Portal
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-2xl mx-auto">
            {settings.welcomeMessage || `Welcome to ${settings.name}`}
          </h1>
          
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto font-normal">
            {settings.tagline || 'Connect to high-speed internet & explore exclusive local perks.'}
          </p>
        </div>

        {/* Lead Form OR Unlocked Wi-Fi View */}
        {!unlockedLead ? (
          <div className="max-w-md mx-auto">
            <LeadForm
              venueId={settings.id}
              venueName={settings.name}
              onSuccess={lead => setUnlockedLead(lead)}
            />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <WifiCard settings={settings} guestName={unlockedLead.name} />
            <LocalDeals deals={settings.deals || []} venueName={settings.name} />
          </div>
        )}

        {/* Self-Service Multi-Tenant Banner */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-emerald-400 mb-1">
              <PlusCircle className="w-4 h-4" /> WiFiPulse Platform
            </div>
            <h4 className="font-bold text-white text-sm sm:text-base">
              Do you own a restaurant, café, or venue?
            </h4>
            <p className="text-slate-400 text-xs mt-0.5">
              Launch your own QR Wi-Fi Lead Capture portal in 60 seconds without developer touch!
            </p>
          </div>
          <Link
            href="/onboard"
            className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <span>Create My Venue Portal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </main>

      <Footer />

    </div>
  );
}
