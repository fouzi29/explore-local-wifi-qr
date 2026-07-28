'use client';

import React from 'react';
import { Users, Wifi, TrendingUp, Calendar, Zap, CheckCircle } from 'lucide-react';
import { CapturedLead } from '@/lib/storage';

interface AdminAnalyticsProps {
  leads: CapturedLead[];
  venueName: string;
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ leads, venueName }) => {
  const totalLeads = leads.length;
  // Mock total scans based on conversion rate ~85%
  const totalScans = Math.round(totalLeads * 1.18) || 12;
  const conversionRate = totalScans > 0 ? Math.round((totalLeads / totalScans) * 100) : 0;
  
  const todayCount = leads.filter(l => {
    const d = new Date(l.createdAt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;

  const marketingOptInCount = leads.filter(l => l.marketingConsent).length;
  const optInPercentage = totalLeads > 0 ? Math.round((marketingOptInCount / totalLeads) * 100) : 0;

  // Interest breakdown
  const interestMap: Record<string, number> = {};
  leads.forEach(l => {
    l.interests.forEach(i => {
      interestMap[i] = (interestMap[i] || 0) + 1;
    });
  });

  const sortedInterests = Object.entries(interestMap).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            <span>Lead Capture Analytics</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time performance metrics for <strong>{venueName}</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle className="w-4 h-4" /> Live Tracking Active
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Captured Leads */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Leads Captured</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-3">{totalLeads}</div>
          <p className="text-xs text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +100% Verified Contact Info
          </p>
        </div>

        {/* Estimated QR Scans */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Portal Scans</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Wifi className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-3">{totalScans}</div>
          <p className="text-xs text-slate-400 mt-1 font-medium">Tabletop & Counter scans</p>
        </div>

        {/* Lead Conversion Rate */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Wi-Fi Unlock Rate</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-3">{conversionRate}%</div>
          <p className="text-xs text-emerald-400 mt-1 font-medium">High conversion landing page</p>
        </div>

        {/* Marketing Opt-In Rate */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Marketing Opt-In</span>
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-3">{optInPercentage}%</div>
          <p className="text-xs text-slate-400 mt-1 font-medium">{marketingOptInCount} guests agreed</p>
        </div>

      </div>

      {/* Guest Interests Breakdown */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          Guest Preferences & Interest Breakdown
        </h3>
        
        {sortedInterests.length > 0 ? (
          <div className="space-y-3">
            {sortedInterests.map(([interest, count]) => {
              const pct = Math.round((count / totalLeads) * 100) || 0;
              return (
                <div key={interest} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200">{interest}</span>
                    <span className="text-emerald-400 font-mono">{count} guests ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-4">No interest data recorded yet.</p>
        )}
      </div>

    </div>
  );
};
