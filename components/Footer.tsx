'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Linkedin, ExternalLink, Briefcase } from 'lucide-react';

interface FooterProps {
  compact?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ compact = false }) => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-6 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Website Link */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <a
            href="https://explore-local-wifi-qr.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-300 font-mono font-medium transition-colors underline decoration-slate-800 underline-offset-4"
          >
            https://explore-local-wifi-qr.vercel.app/
          </a>
        </div>

        {/* Developer / Indirect Hire Links (LinkedIn & Fiverr) */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-teal-400" /> Built by MD. Fouzi &bull; Available for Hire:
          </span>

          {/* LinkedIn Profile */}
          <a
            href="https://www.linkedin.com/in/mdfouzi/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-blue-500/40 text-[11px] font-semibold transition-all group"
          >
            <Linkedin className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span>LinkedIn</span>
            <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
          </a>

          {/* Fiverr Profile */}
          <a
            href="https://www.fiverr.com/s/o8DxWjG"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-emerald-500/40 text-[11px] font-semibold transition-all group"
          >
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] flex items-center justify-center group-hover:scale-110 transition-transform">
              fi
            </span>
            <span>Fiverr Profile</span>
            <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
          </a>
        </div>

      </div>

      <div className="max-w-6xl mx-auto px-4 mt-3 pt-3 border-t border-slate-900/60 text-center text-[11px] text-slate-600">
        © 2026 MD. Fouzi • All Rights Reserved
      </div>
    </footer>
  );
};
