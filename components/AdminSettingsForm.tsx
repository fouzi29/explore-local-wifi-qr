'use client';

import React, { useState } from 'react';
import { Save, Mail, Wifi, Tag, Check, AlertCircle, Send, Shield, Plus, Trash2 } from 'lucide-react';
import { VenueSettings, SmtpConfig, VenueDeal } from '@/lib/storage';

interface AdminSettingsFormProps {
  settings: VenueSettings;
  onSave: (updated: VenueSettings) => void;
}

export const AdminSettingsForm: React.FC<AdminSettingsFormProps> = ({ settings, onSave }) => {
  const [activeSubTab, setActiveSubTab] = useState<'wifi' | 'smtp' | 'deals'>('wifi');
  
  // Wi-Fi & Branding State
  const [name, setName] = useState(settings.name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [welcomeMessage, setWelcomeMessage] = useState(settings.welcomeMessage);
  const [ssid, setSsid] = useState(settings.wifi.ssid);
  const [password, setPassword] = useState(settings.wifi.password);
  const [encryption, setEncryption] = useState(settings.wifi.encryption);

  // SMTP State
  const [smtp, setSmtp] = useState<SmtpConfig>(settings.smtp || {
    enabled: false,
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    user: '',
    pass: '',
    fromName: settings.name + ' Wi-Fi Portal',
    fromEmail: '',
    notifyEmail: ''
  });

  // Deals State
  const [deals, setDeals] = useState<VenueDeal[]>(settings.deals || []);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Email Diagnostic Test State
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const updatedSettings: VenueSettings = {
      ...settings,
      name,
      tagline,
      welcomeMessage,
      wifi: {
        ssid,
        password,
        encryption
      },
      smtp,
      deals
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      const data = await res.json();
      if (data.success) {
        onSave(updatedSettings);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setSaving(false);
    }
  };

  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtp)
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ success: false, message: 'Failed to test SMTP connection.' });
    } finally {
      setTestingSmtp(false);
    }
  };

  const addDealItem = () => {
    const newDeal: VenueDeal = {
      id: 'deal_' + Date.now(),
      title: 'New Local Perk',
      description: 'Describe the offer or local guide spot here.',
      discountCode: 'SPECIAL' + Math.floor(Math.random() * 900 + 100),
      badge: 'Venue Perk',
      iconName: 'Gift'
    };
    setDeals([...deals, newDeal]);
  };

  const removeDealItem = (id: string) => {
    setDeals(deals.filter(d => d.id !== id));
  };

  const updateDealItem = (id: string, key: keyof VenueDeal, val: string) => {
    setDeals(deals.map(d => (d.id === id ? { ...d, [key]: val } : d)));
  };

  return (
    <div className="space-y-6">
      
      {/* Settings Sub-Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('wifi')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'wifi'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Wifi className="w-4 h-4" /> Wi-Fi & Venue Branding
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('smtp')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'smtp'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" /> Optional SMTP Email Alerts
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('deals')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'deals'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" /> Unlocked Local Deals ({deals.length})
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center flex items-center justify-center gap-2">
          <Check className="w-4 h-4" /> Settings updated successfully!
        </div>
      )}

      {/* SUB-TAB 1: WI-FI & VENUE BRANDING */}
      {activeSubTab === 'wifi' && (
        <form onSubmit={handleSaveAll} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
            Venue Info & Wi-Fi Credentials
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Venue Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Tagline / Subheading
              </label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Hero Welcome Banner Message
            </label>
            <input
              type="text"
              value={welcomeMessage}
              onChange={e => setWelcomeMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs"
            />
          </div>

          <hr className="border-slate-800" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Wi-Fi Network Name (SSID)
              </label>
              <input
                type="text"
                required
                value={ssid}
                onChange={e => setSsid(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Wi-Fi Password
              </label>
              <input
                type="text"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Security Encryption
              </label>
              <select
                value={encryption}
                onChange={e => setEncryption(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs bg-slate-900"
              >
                <option value="WPA2">WPA / WPA2 (Default)</option>
                <option value="WPA">WPA</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Open Network (No Password)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> Save Wi-Fi Credentials
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 2: OPTIONAL SMTP EMAIL SERVER SETUP */}
      {activeSubTab === 'smtp' && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" /> Lead Email Alert Settings
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated lead alert emails are sent out-of-the-box via system mailer. Optionally configure your own custom SMTP server below.
              </p>
            </div>

            {/* Enable Toggle */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smtp.enabled}
                onChange={e => setSmtp({ ...smtp, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-2 text-xs font-bold text-slate-200">
                {smtp.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                SMTP Host Server
              </label>
              <input
                type="text"
                placeholder="e.g. smtp.gmail.com or mail.yourdomain.com"
                value={smtp.host}
                onChange={e => setSmtp({ ...smtp, host: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Port
                </label>
                <input
                  type="number"
                  placeholder="587 or 465"
                  value={smtp.port}
                  onChange={e => setSmtp({ ...smtp, port: parseInt(e.target.value) || 587 })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs font-mono"
                />
              </div>
              <div className="pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smtp.secure}
                    onChange={e => setSmtp({ ...smtp, secure: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-300 font-semibold">SSL/TLS (Port 465)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                SMTP Username / Sender Email
              </label>
              <input
                type="text"
                placeholder="yourname@gmail.com"
                value={smtp.user}
                onChange={e => setSmtp({ ...smtp, user: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                SMTP Password / App Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={smtp.pass}
                onChange={e => setSmtp({ ...smtp, pass: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Sender Name Header
              </label>
              <input
                type="text"
                placeholder="Rustic Roaster Wi-Fi Portal"
                value={smtp.fromName}
                onChange={e => setSmtp({ ...smtp, fromName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Recipient Email (Where leads are sent)
              </label>
              <input
                type="email"
                placeholder="owner@rusticroaster.com"
                value={smtp.notifyEmail}
                onChange={e => setSmtp({ ...smtp, notifyEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs font-mono"
              />
            </div>
          </div>

          {testResult && (
            <div className={`p-3.5 rounded-xl border text-xs font-medium ${
              testResult.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              {testResult.success ? '✅ ' : '❌ '} {testResult.message}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
            >
              <Save className="w-4 h-4" /> Save SMTP Settings
            </button>

            <button
              type="button"
              onClick={handleTestSmtp}
              disabled={testingSmtp}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all disabled:opacity-50"
            >
              {testingSmtp ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-3.5 h-3.5 text-teal-400" />
              )}
              <span>Send Test Diagnostic Email</span>
            </button>
          </div>

        </div>
      )}

      {/* SUB-TAB 3: LOCAL DEALS MANAGER */}
      {activeSubTab === 'deals' && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Manage Unlocked Deals & Guide Recommendations
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                These perks are presented to guests after they complete lead capture.
              </p>
            </div>

            <button
              type="button"
              onClick={addDealItem}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Deal
            </button>
          </div>

          <div className="space-y-4">
            {deals.map(deal => (
              <div key={deal.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">{deal.badge || 'Perk'}</span>
                  <button
                    type="button"
                    onClick={() => removeDealItem(deal.id)}
                    className="text-slate-500 hover:text-red-400 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-semibold mb-1">Deal Title</label>
                    <input
                      type="text"
                      value={deal.title}
                      onChange={e => updateDealItem(deal.id, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg glass-input text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-semibold mb-1">Discount Code</label>
                    <input
                      type="text"
                      value={deal.discountCode}
                      onChange={e => updateDealItem(deal.id, 'discountCode', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg glass-input text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-semibold mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={deal.badge}
                      onChange={e => updateDealItem(deal.id, 'badge', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg glass-input text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">Description</label>
                  <input
                    type="text"
                    value={deal.description}
                    onChange={e => updateDealItem(deal.id, 'description', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg glass-input text-white text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleSaveAll()}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
            >
              <Save className="w-4 h-4" /> Save Deals List
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
