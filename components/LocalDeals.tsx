'use client';

import React, { useState } from 'react';
import { Gift, Coffee, MapPin, Tag, Check, Sparkles, Compass } from 'lucide-react';
import { VenueDeal } from '@/lib/storage';

interface LocalDealsProps {
  deals: VenueDeal[];
  venueName: string;
}

export const LocalDeals: React.FC<LocalDealsProps> = ({ deals, venueName }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCoupon = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 3000);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee': return <Coffee className="w-5 h-5 text-amber-400" />;
      case 'MapPin': return <MapPin className="w-5 h-5 text-emerald-400" />;
      default: return <Gift className="w-5 h-5 text-teal-400" />;
    }
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Unlocked Local Perks & Guide
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Exclusive venue specials & nearby neighborhood highlights for {venueName} guests.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {deals.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {deals.map(deal => (
          <div
            key={deal.id}
            className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {getIcon(deal.iconName)}
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {deal.badge}
                </span>
              </div>

              <h4 className="font-bold text-white text-base leading-snug group-hover:text-emerald-300 transition-colors">
                {deal.title}
              </h4>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                {deal.description}
              </p>
            </div>

            {deal.discountCode && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono font-bold text-slate-200">{deal.discountCode}</span>
                </div>
                <button
                  onClick={() => copyCoupon(deal.discountCode)}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
                >
                  {copiedCode === deal.discountCode ? (
                    <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Saved</span>
                  ) : (
                    'Copy Code'
                  )}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
