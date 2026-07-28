'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { AdminAnalytics } from '@/components/AdminAnalytics';
import { AdminLeadsTable } from '@/components/AdminLeadsTable';
import { AdminQrStudio } from '@/components/AdminQrStudio';
import { AdminSettingsForm } from '@/components/AdminSettingsForm';
import { MasterAdminTelemetry } from '@/components/MasterAdminTelemetry';
import { getVenueSettings, getVenueLeads, VenueSettings, CapturedLead } from '@/lib/storage';
import { LayoutDashboard, Users, QrCode, Settings, ShieldCheck, ExternalLink, Sparkles, Wifi } from 'lucide-react';
import Link from 'next/link';

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const venueId = searchParams.get('venueId') || 'venue_default';
  const initialTab = searchParams.get('tab') || 'analytics';

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [settings, setSettings] = useState<VenueSettings | null>(null);
  const [leads, setLeads] = useState<CapturedLead[]>([]);

  const loadData = () => {
    fetch(`/api/settings?venueId=${venueId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        } else {
          setSettings(getVenueSettings(venueId));
        }
      })
      .catch(() => setSettings(getVenueSettings(venueId)));

    fetch(`/api/leads?venueId=${venueId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.leads) {
          setLeads(data.leads);
        } else {
          setLeads(getVenueLeads(venueId));
        }
      })
      .catch(() => setLeads(getVenueLeads(venueId)));
  };

  useEffect(() => {
    loadData();
  }, [venueId]);

  if (!settings) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      
      <Navbar venueName={settings.name} venueId={settings.id} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 lg:px-8 py-8 space-y-6">
        
        {/* Dashboard Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Venue Dashboard
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {settings.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              {settings.name}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              SSID: <strong className="text-slate-200 font-mono">{settings.wifi.ssid}</strong> • Lead Capture & Local Recommendations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/?venueId=${settings.id}`}
              target="_blank"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
            >
              <span>Preview Live Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3">
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Analytics Overview
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'leads'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" /> Captured Leads ({leads.length})
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'qr'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" /> Tabletop QR Stand Studio
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" /> Wi-Fi & SMTP Setup
          </button>

          <button
            onClick={() => setActiveTab('master')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'master'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                : 'bg-slate-900/80 text-teal-400 hover:text-teal-300 hover:bg-slate-800 border border-teal-500/30'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Master Creator Telemetry
          </button>

        </div>

        {/* Tab Content Rendering */}
        <div className="pt-2">
          {activeTab === 'analytics' && <AdminAnalytics leads={leads} venueName={settings.name} />}
          {activeTab === 'leads' && <AdminLeadsTable leads={leads} venueName={settings.name} />}
          {activeTab === 'qr' && <AdminQrStudio settings={settings} />}
          {activeTab === 'settings' && (
            <AdminSettingsForm settings={settings} onSave={updated => setSettings(updated)} />
          )}
          {activeTab === 'master' && <MasterAdminTelemetry />}
        </div>

      </main>

    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        Loading Admin Dashboard...
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}
