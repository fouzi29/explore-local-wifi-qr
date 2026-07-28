'use client';

import React, { useState } from 'react';
import { Smartphone, Laptop, Sparkles } from 'lucide-react';
import { LeadForm } from '@/components/LeadForm';
import { WifiCard } from '@/components/WifiCard';
import { getVenueSettings, CapturedLead } from '@/lib/storage';

export const SaaSDemoWidget: React.FC = () => {
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [demoLead, setDemoLead] = useState<CapturedLead | null>(null);

  const defaultVenue = getVenueSettings('venue_default');

  return (
    <section className="py-10 sm:py-16 bg-slate-950 px-2 sm:px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Live Product Simulator
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            See Exactly How Guests Connect & How You Collect Leads
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
            Test the live guest phone experience right here. Submit sample lead info below to see the Wi-Fi credentials unlock!
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center justify-center gap-2 pb-2">
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'mobile'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" /> Guest Phone View
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'desktop'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4" /> Full Screen Portal
          </button>
        </div>

        {/* Phone Frame Simulator Container */}
        <div className="flex justify-center">
          
          {viewMode === 'mobile' ? (
            <div className="w-full max-w-[340px] sm:max-w-sm bg-slate-900 rounded-[28px] sm:rounded-[40px] p-2.5 sm:p-4 border-4 sm:border-8 border-slate-800 shadow-2xl relative overflow-hidden">
              
              {/* Phone Notch */}
              <div className="w-28 sm:w-32 h-4 sm:h-5 bg-slate-800 rounded-b-2xl mx-auto mb-3 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950"></div>
              </div>

              {/* Mobile Content */}
              <div className="space-y-3 max-h-[580px] sm:max-h-[620px] overflow-y-auto pr-0.5">
                <div className="text-center py-1">
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">
                    {defaultVenue.name}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                    Free Guest Wi-Fi
                  </h3>
                </div>

                {!demoLead ? (
                  <LeadForm
                    venueId={defaultVenue.id}
                    venueName={defaultVenue.name}
                    onSuccess={lead => setDemoLead(lead)}
                  />
                ) : (
                  <div className="space-y-4 animate-fade-in">
                    <WifiCard settings={defaultVenue} guestName={demoLead.name} />
                    <button
                      onClick={() => setDemoLead(null)}
                      className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                    >
                      Reset Simulator Demo
                    </button>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="w-full max-w-3xl glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shrink-0"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"></div>
                  <span className="text-[11px] sm:text-xs font-mono text-slate-400 truncate">https://yourdomain.com/v/rustic-roaster</span>
                </div>
                <span className="text-[10px] sm:text-xs text-emerald-400 font-bold shrink-0">Live Simulation</span>
              </div>

              {!demoLead ? (
                <LeadForm
                  venueId={defaultVenue.id}
                  venueName={defaultVenue.name}
                  onSuccess={lead => setDemoLead(lead)}
                />
              ) : (
                <div className="space-y-4">
                  <WifiCard settings={defaultVenue} guestName={demoLead.name} />
                  <button
                    onClick={() => setDemoLead(null)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                  >
                    Reset Simulator
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
