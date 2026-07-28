'use client';

import React, { useState } from 'react';
import { Search, Download, Trash2, Mail, Smartphone, CheckCircle, XCircle } from 'lucide-react';
import { CapturedLead } from '@/lib/storage';
import { downloadCsv } from '@/lib/wifi';

interface AdminLeadsTableProps {
  leads: CapturedLead[];
  venueName: string;
}

export const AdminLeadsTable: React.FC<AdminLeadsTableProps> = ({ leads, venueName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [consentFilter, setConsentFilter] = useState<'all' | 'opted_in' | 'opted_out'>('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.emailOrPhone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesConsent =
      consentFilter === 'all' ||
      (consentFilter === 'opted_in' && lead.marketingConsent) ||
      (consentFilter === 'opted_out' && !lead.marketingConsent);

    return matchesSearch && matchesConsent;
  });

  const handleExportCsv = () => {
    const exportData = filteredLeads.map(l => ({
      'Lead ID': l.id,
      'Guest Name': l.name,
      'Email or Phone': l.emailOrPhone,
      'Interests': l.interests.join(' | '),
      'Marketing Opt-In': l.marketingConsent ? 'Yes' : 'No',
      'Device Type': l.deviceType || 'Mobile',
      'Captured Date': new Date(l.createdAt).toLocaleString()
    }));

    const filename = `${venueName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_leads_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCsv(filename, exportData);
  };

  return (
    <div className="space-y-4">
      
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-800">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search leads by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-white text-xs placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Filter & Export */}
        <div className="flex items-center gap-3">
          <select
            value={consentFilter}
            onChange={e => setConsentFilter(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl glass-input text-white text-xs bg-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="all">All Opt-In Statuses</option>
            <option value="opted_in">✅ Opted In Only</option>
            <option value="opted_out">❌ Opted Out Only</option>
          </select>

          <button
            onClick={handleExportCsv}
            disabled={filteredLeads.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV ({filteredLeads.length})</span>
          </button>
        </div>

      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Guest Name</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Interests</th>
                <th className="py-3.5 px-4">Marketing</th>
                <th className="py-3.5 px-4">Device</th>
                <th className="py-3.5 px-4">Date Captured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.length > 0 ? (
                filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {lead.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-emerald-400">
                      {lead.emailOrPhone}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {lead.interests.map(i => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">
                            {i}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {lead.marketingConsent ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[10px]">
                          <CheckCircle className="w-3 h-3" /> Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 font-medium bg-slate-800 px-2 py-0.5 rounded-full text-[10px]">
                          <XCircle className="w-3 h-3 text-slate-500" /> No
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-slate-500" /> {lead.deviceType || 'Mobile'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(lead.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No leads found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
