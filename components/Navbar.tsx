'use client';

import React from 'react';
import Link from 'next/link';
import { Wifi, ShieldCheck, PlusCircle, Sparkles, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  venueName?: string;
  venueId?: string;
  activeTab?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ venueName = 'Explore Local', venueId = 'venue_default' }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link href={`/?venueId=${venueId}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Wifi className="w-5 h-5 text-emerald-400 animate-pulse-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                {venueName}
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Wi-Fi
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Free High-Speed Wi-Fi & Local Perks</p>
          </div>
        </Link>

        {/* Action Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/onboard"
            className="hidden md:flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-all hover:border-slate-600"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Create Venue Portal</span>
          </Link>

          <Link
            href={`/admin?venueId=${venueId}`}
            className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all hover:shadow-emerald-500/30"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </Link>
        </div>

      </div>
    </header>
  );
};
