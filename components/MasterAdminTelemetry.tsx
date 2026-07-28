'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert, Server, Users, Activity, Globe, Save, CheckCircle, Mail } from 'lucide-react';
import { PlatformTelemetry } from '@/lib/storage';

export const MasterAdminTelemetry: React.FC = () => {
  const [telemetry, setTelemetry] = useState<PlatformTelemetry | null>(null);
  const [creatorEmail, setCreatorEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/telemetry')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.telemetry) {
          setTelemetry(data.telemetry);
          setCreatorEmail(data.telemetry.creatorNotificationEmail || '');
        }
      })
      .catch(err => console.error('Failed to load telemetry', err));
  }, []);

  const handleSaveCreatorEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorNotificationEmail: creatorEmail })
      });
      const data = await res.json();
      if (data.success) {
        setTelemetry(data.telemetry);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save creator email', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Master Banner */}
      <div className="glass-card p-6 rounded-2xl border border-teal-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-[11px] font-bold border border-teal-500/20 mb-1">
              <ShieldAlert className="w-3 h-3" /> System Creator Telemetry
            </div>
            <h2 className="text-xl font-bold text-white">Platform Owner Usage & Master Telemetry</h2>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-2xl">
          Anyone can set up their own venue QR portal independently without your intervention. This master panel monitors platform adoption, total active venues, and overall lead generation across all system users.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Total Self-Service Venues</span>
          <div className="text-3xl font-extrabold text-white mt-2">
            {telemetry?.totalVenuesCreated ?? 1}
          </div>
          <p className="text-xs text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" /> Zero-touch venue deployments
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Platform-Wide Leads Captured</span>
          <div className="text-3xl font-extrabold text-white mt-2">
            {telemetry?.totalLeadsCaptured ?? 3}
          </div>
          <p className="text-xs text-teal-400 mt-1 font-medium flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Total system guest contacts
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Latest Activity Timestamp</span>
          <div className="text-sm font-mono font-bold text-slate-200 mt-3 truncate">
            {telemetry?.lastLeadTimestamp ? new Date(telemetry.lastLeadTimestamp).toLocaleString() : 'Active Now'}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Telemetry Syncing
          </p>
        </div>

      </div>

      {/* Platform Owner Digest Email Config */}
      <form onSubmit={handleSaveCreatorEmail} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Mail className="w-4 h-4 text-emerald-400" /> Platform Creator Usage Alerts Email
        </h3>
        <p className="text-xs text-slate-400">
          Enter your email address to receive system usage digests and notification alerts whenever new business venues or lead milestones are achieved on your platform.
        </p>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Creator alert email saved!
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={creatorEmail}
            onChange={e => setCreatorEmail(e.target.value)}
            placeholder="your-admin-email@example.com"
            className="flex-1 px-4 py-2.5 rounded-xl glass-input text-white text-xs font-mono"
          />
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Save Creator Email
          </button>
        </div>
      </form>

    </div>
  );
};
