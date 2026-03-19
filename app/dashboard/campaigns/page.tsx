'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Mail, MessageSquare, Play, Pause, Trash2, Zap, BarChart2, Users, Clock, RefreshCw } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://voxelixhub-backend.onrender.com';

function getToken() {
  return localStorage.getItem('token') || '';
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

interface CampaignStep {
  delayDays: number;
  subject?: string;
  body: string;
}

interface Campaign {
  id: string;
  name: string;
  description?: string;
  channel: 'EMAIL' | 'SMS';
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT' | 'ARCHIVED';
  trigger: string;
  steps: CampaignStep[];
  _count?: { enrollments: number };
  createdAt: string;
}

interface NewCampaignForm {
  name: string;
  description: string;
  channel: string;
  trigger: string;
  steps: CampaignStep[];
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE:   'bg-green-500/20 text-green-400',
  PAUSED:   'bg-amber-500/20 text-amber-400',
  DRAFT:    'bg-gray-500/20 text-gray-400',
  ARCHIVED: 'bg-red-500/20 text-red-400',
};

function fmt(n: number) {
  return (n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function NewCampaignModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<NewCampaignForm>({
    name: '', description: '', channel: 'EMAIL', trigger: 'MANUAL',
    steps: [{ delayDays: 0, subject: '', body: '' }],
  });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const addStep = () => setForm(f => ({
    ...f, steps: [...f.steps, { delayDays: f.steps.length * 3, subject: '', body: '' }],
  }));

  const updateStep = (i: number, field: string, value: string | number) => {
    setForm(f => ({ ...f, steps: f.steps.map((s, idx) => idx === i ? { ...s, [field]: value } : s) }));
  };

  const generateAI = async () => {
    if (!form.name) return;
    setGenerating(true);
    try {
      const subject = `Special offer — ${form.name}`;
      const body = form.channel === 'EMAIL'
        ? `<p>Hi [First Name],</p><p>Thank you for your interest. We have an exclusive offer regarding <strong>${form.name}</strong>.</p><p>Reply to this email or call us to learn more.</p><p>Best regards,<br/>The Team</p>`
        : `Hi [First Name], we have a special offer for you: ${form.name}. Reply YES to learn more or call us now.`;
      setForm(f => ({ ...f, steps: f.steps.map((s, i) => i === 0 ? { ...s, subject, body } : s) }));
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.steps[0]?.body) { setError('Name and message body are required'); return; }
    setSaving(true); setError('');
    try {
      await apiFetch('/v1/campaigns', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          channel: form.channel,
          trigger: form.trigger,
          steps: form.steps.map((s, i) => ({
            stepNumber: i + 1,
            delayDays: parseInt(String(s.delayDays)) || 0,
            subject: s.subject || null,
            body: s.body,
          })),
        }),
      });
      onSaved(); onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:50,padding:'1rem',overflowY:'auto' }}>
      <div className="bg-dark-300 border border-dark-100 rounded-xl w-full max-w-lg p-6 my-8">
        <h2 className="font-bold text-lg text-white mb-5">Create new campaign</h2>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400 mb-1.5 block">Campaign name *</label>
            <input className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Welcome new leads" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400 mb-1.5 block">Channel</label>
            <div className="flex gap-2">
              {['EMAIL', 'SMS'].map(ch => (
                <button key={ch} onClick={() => setForm(f => ({ ...f, channel: ch }))}
                  className={['flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-all',
                    form.channel === ch ? 'bg-brand-500/20 border-brand-500/50 text-brand-400' : 'border-dark-100 text-gray-400 hover:border-gray-600'].join(' ')}>
                  {ch === 'EMAIL' ? <Mail size={15} /> : <MessageSquare size={15} />}{ch}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400 mb-1.5 block">Trigger</label>
            <select className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none"
              value={form.trigger} onChange={e => setForm(f => ({ ...f, trigger: e.target.value }))}>
              <option value="MANUAL">Manual enrollment</option>
              <option value="NEW_LEAD">New lead created</option>
              <option value="STATUS_CHANGE">Lead status changes</option>
            </select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">Steps ({form.steps.length})</label>
              <div className="flex gap-2">
                <button onClick={generateAI} disabled={generating || !form.name}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent-500/10 border border-accent-500/30 text-accent-400 text-xs font-semibold hover:bg-accent-500/20 transition-colors disabled:opacity-40">
                  <Zap size={12} />{generating ? 'Generating...' : 'AI fill step 1'}
                </button>
                <button onClick={addStep}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-dark-200 border border-dark-100 text-gray-400 text-xs font-semibold hover:text-white transition-colors">
                  <Plus size={12} /> Add step
                </button>
              </div>
            </div>
            {form.steps.map((step, i) => (
              <div key={i} className="border border-dark-100 rounded-lg p-3 mb-3 bg-dark-200">
                <p className="text-xs font-semibold text-gray-400 mb-2">Step {i + 1}</p>
                <div className="flex gap-2 mb-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Send after (days)</label>
                    <input type="number" min={0}
                      className="w-full px-2 py-1.5 rounded border border-dark-100 bg-dark-300 text-white text-sm outline-none"
                      value={step.delayDays} onChange={e => updateStep(i, 'delayDays', parseInt(e.target.value) || 0)} />
                  </div>
                  {form.channel === 'EMAIL' && (
                    <div className="flex-[2]">
                      <label className="text-xs text-gray-500 mb-1 block">Subject</label>
                      <input className="w-full px-2 py-1.5 rounded border border-dark-100 bg-dark-300 text-white text-sm outline-none"
                        value={step.subject || ''} onChange={e => updateStep(i, 'subject', e.target.value)} placeholder="Email subject" />
                    </div>
                  )}
                </div>
                <label className="text-xs text-gray-500 mb-1 block">Message body</label>
                <textarea className="w-full px-2 py-1.5 rounded border border-dark-100 bg-dark-300 text-white text-sm outline-none resize-none h-24"
                  value={step.body} onChange={e => updateStep(i, 'body', e.target.value)} placeholder="Write your message..." />
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-dark-100 text-gray-400 text-sm font-medium hover:bg-dark-200 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.name}
            className="flex-1 px-4 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors disabled:opacity-40">
            {saving ? 'Saving...' : 'Create campaign'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const fetchCampaigns = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const data = await apiFetch('/v1/campaigns');
      setCampaigns(data.campaigns || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const toggleStatus = async (c: Campaign) => {
    const newStatus = c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      await apiFetch(`/v1/campaigns/${c.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
      fetchCampaigns();
    } catch (e: any) { alert(e.message); }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm('Delete this campaign?')) return;
    try {
      await apiFetch(`/v1/campaigns/${id}`, { method: 'DELETE' });
      fetchCampaigns();
    } catch (e: any) { alert(e.message); }
  };

  const filtered = campaigns.filter(c => filter === 'ALL' || c.status === filter);
  const totalEnrollments = campaigns.reduce((a, c) => a + (c._count?.enrollments || 0), 0);
  const active = campaigns.filter(c => c.status === 'ACTIVE').length;

  const STATS = [
    { label: 'Total campaigns', value: String(campaigns.length), icon: Mail,     color: 'text-brand-400', bg: 'bg-brand-500/20' },
    { label: 'Active',          value: String(active),           icon: Zap,      color: 'text-green-400', bg: 'bg-green-500/20' },
    { label: 'Enrollments',     value: fmt(totalEnrollments),    icon: Users,    color: 'text-amber-400', bg: 'bg-amber-500/20' },
    { label: 'Channels',        value: '2',                      icon: BarChart2,color: 'text-purple-400',bg: 'bg-purple-500/20' },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
          <p className="text-gray-500 mt-1">Email and SMS drip sequences</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchCampaigns} className="p-2.5 rounded-lg border border-dark-100 text-gray-400 hover:text-white transition-colors">
            <RefreshCw size={16} />
          </button>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors">
            <Plus size={16} /> New campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(s => (
          <div key={s.label} className="bg-dark-300 border border-dark-100 rounded-xl p-5">
            <div className={['w-9 h-9 rounded-xl flex items-center justify-center mb-3', s.bg, s.color].join(' ')}>
              <s.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        {['ALL', 'ACTIVE', 'PAUSED', 'DRAFT', 'ARCHIVED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={['px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              filter === f ? 'bg-brand-500 text-white' : 'bg-dark-300 border border-dark-100 text-gray-400 hover:text-white'].join(' ')}>
            {f}
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="bg-dark-300 border border-dark-100 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-500">Loading campaigns...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Mail size={32} className="mb-3 opacity-30" />
            <p className="font-medium">No campaigns yet</p>
            <p className="text-sm mt-1">Create your first drip campaign to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-100">
                  {['Campaign', 'Channel', 'Status', 'Trigger', 'Steps', 'Enrollments', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-dark-200 transition-colors group">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-white">{c.name}</p>
                      {c.description && <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{c.description}</p>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={['flex items-center gap-1.5 text-xs font-semibold w-fit', c.channel === 'EMAIL' ? 'text-blue-400' : 'text-green-400'].join(' ')}>
                        {c.channel === 'EMAIL' ? <Mail size={13} /> : <MessageSquare size={13} />}{c.channel}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={['px-2 py-0.5 rounded-full text-xs font-semibold', STATUS_STYLES[c.status]].join(' ')}>{c.status}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-xs">{c.trigger}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock size={13} /><span>{c.steps?.length || 0} steps</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Users size={13} /><span>{fmt(c._count?.enrollments || 0)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => toggleStatus(c)}
                          className={['p-1.5 rounded-md transition-colors', c.status === 'ACTIVE' ? 'hover:bg-amber-500/20 hover:text-amber-400 text-gray-500' : 'hover:bg-green-500/20 hover:text-green-400 text-gray-500'].join(' ')}>
                          {c.status === 'ACTIVE' ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                        <button onClick={() => deleteCampaign(c.id)} className="p-1.5 rounded-md hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-3 border-t border-dark-100 text-xs text-gray-500">
          Showing {filtered.length} of {campaigns.length} campaigns
        </div>
      </div>

      {showModal && <NewCampaignModal onClose={() => setShowModal(false)} onSaved={fetchCampaigns} />}
    </div>
  );
}
