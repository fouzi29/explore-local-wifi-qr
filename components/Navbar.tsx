'use client';

import React from 'react';
import Link from 'next/link';
import { Wifi, PlusCircle, Sparkles, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  venueName?: string;
  venueId?: string;
  activeTab?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ venueName = 'Explore Local', venueId = 'venue_default' }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-3 sm:px-6 py-3 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        
        {/* Brand / Logo */}
        <Link href={`/?venueId=${venueId}`} className="flex items-center gap-2.5 min-w-0 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 animate-pulse-slow" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold text-sm sm:text-base tracking-tight text-white truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none">
                {venueName}
              </span>
              <span className="hidden xs:inline-flex bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-full items-center gap-1 shrink-0">
                <Sparkles className="w-2.5 h-2.5" /> Wi-Fi
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate">Free High-Speed Wi-Fi</p>
          </div>
        </Link>

        {/* Action Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Link
            href="/onboard"
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-all"
            title="Create Venue Portal"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Create Portal</span>
          </Link>

          <Link
            href={`/admin?venueId=${venueId}`}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Admin</span>
          </Link>
        </div>

      </div>
    </header>
  );
};
