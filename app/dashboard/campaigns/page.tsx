'use client';

import { useState } from 'react';
import { Plus, Mail, MessageSquare, Play, Pause, Trash2, Edit2, Zap, BarChart2, Users, Clock } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  type: 'EMAIL' | 'SMS';
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT' | 'COMPLETED';
  subject: string;
  audience: number;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  steps: number;
  createdAt: string;
}

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Welcome New Leads',   type: 'EMAIL', status: 'ACTIVE',    subject: 'Welcome to Cape Town Auto!',              audience: 342, sent: 342, opened: 271, clicked: 98,  converted: 23, steps: 5, createdAt: '2026-03-10' },
  { id: '2', name: 'Hot Lead Follow-Up',  type: 'SMS',   status: 'ACTIVE',    subject: 'Follow up on your enquiry',               audience: 87,  sent: 87,  opened: 79,  clicked: 44,  converted: 18, steps: 3, createdAt: '2026-03-12' },
  { id: '3', name: 'Test Drive No-Show',  type: 'EMAIL', status: 'PAUSED',    subject: 'We missed you — rebook your test drive',  audience: 45,  sent: 22,  opened: 10,  clicked: 4,   converted: 1,  steps: 2, createdAt: '2026-03-08' },
  { id: '4', name: 'End of Month Special',type: 'EMAIL', status: 'COMPLETED', subject: 'March Special — R50k off selected models',audience: 890, sent: 890, opened: 654, clicked: 230, converted: 45, steps: 1, createdAt: '2026-03-01' },
  { id: '5', name: 'Finance Pre-Approval',type: 'SMS',   status: 'DRAFT',     subject: 'Get pre-approved in 5 minutes',           audience: 0,   sent: 0,   opened: 0,   clicked: 0,   converted: 0,  steps: 3, createdAt: '2026-03-16' },
];

const STATUS_STYLES: Record<string, string> = {
  ACTIVE:    'bg-green-500/20 text-green-400',
  PAUSED:    'bg-amber-500/20 text-amber-400',
  DRAFT:     'bg-gray-500/20 text-gray-400',
  COMPLETED: 'bg-brand-500/20 text-brand-400',
};

function fmt(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

interface NewCampaign {
  name: string;
  type: string;
  subject: string;
  message: string;
}

function NewCampaignModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: NewCampaign) => void }) {
  const [form, setForm] = useState<NewCampaign>({ name: '', type: 'EMAIL', subject: '', message: '' });
  const [generating, setGenerating] = useState(false);

  const generateAI = async () => {
    if (!form.name) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    setForm({
      ...form,
      subject: 'Special offer — ' + form.name,
      message: 'Hi [First Name],\n\nThank you for your interest in Cape Town Auto.\n\n' + form.name + '.\n\nReply YES to learn more or call us on 021 123 4567.\n\nBest regards,\nCape Town Auto Team',
    });
    setGenerating(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-300 border border-dark-100 rounded-xl w-full max-w-lg p-6">
        <h2 className="font-bold text-lg text-white mb-6">Create New Campaign</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400 mb-1.5 block">Campaign Name *</label>
            <input
              className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. March Special Offer"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400 mb-1.5 block">Type</label>
            <div className="flex gap-2">
              {['EMAIL', 'SMS'].map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, type: t })}
                  className={[
                    'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-all',
                    form.type === t
                      ? 'bg-brand-500/20 border-brand-500/50 text-brand-400'
                      : 'border-dark-100 text-gray-400 hover:border-gray-600'
                  ].join(' ')}
                >
                  {t === 'EMAIL' ? <Mail size={15} /> : <MessageSquare size={15} />}
                  {t}
                </button>
              ))}
            </div>
          </div>
          {form.type === 'EMAIL' && (
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">Subject Line</label>
              <input
                className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g. Special offer just for you"
              />
            </div>
          )}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-400">Message</label>
              <button
                onClick={generateAI}
                disabled={generating || !form.name}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent-500/10 border border-accent-500/30 text-accent-400 text-xs font-semibold hover:bg-accent-500/20 transition-colors disabled:opacity-40"
              >
                <Zap size={12} />
                {generating ? 'Generating...' : 'AI Generate'}
              </button>
            </div>
            <textarea
              className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors resize-none h-32"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write your message or click AI Generate..."
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-dark-100 text-gray-400 text-sm font-medium hover:bg-dark-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onAdd(form); onClose(); }}
            disabled={!form.name}
            className="flex-1 px-4 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors disabled:opacity-40"
          >
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const filtered = campaigns.filter((c) => filter === 'ALL' || c.status === filter);

  const toggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' }
          : c
      )
    );
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAdd = (data: NewCampaign) => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: data.name,
      type: data.type as 'EMAIL' | 'SMS',
      status: 'DRAFT',
      subject: data.subject,
      audience: 0,
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      steps: 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
  };

  const totalSent = campaigns.reduce((a, c) => a + c.sent, 0);
  const totalOpened = campaigns.reduce((a, c) => a + c.opened, 0);
  const totalConverted = campaigns.reduce((a, c) => a + c.converted, 0);
  const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;

  const STATS = [
    { label: 'Total Sent',   value: fmt(totalSent),      icon: Mail,     color: 'text-brand-400', bg: 'bg-brand-500/20' },
    { label: 'Open Rate',    value: openRate + '%',       icon: BarChart2, color: 'text-green-400', bg: 'bg-green-500/20' },
    { label: 'Conversions',  value: fmt(totalConverted),  icon: Users,    color: 'text-amber-400', bg: 'bg-amber-500/20' },
    { label: 'Active Flows', value: String(campaigns.filter((c) => c.status === 'ACTIVE').length), icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
          <p className="text-gray-500 mt-1">Email and SMS drip sequences powered by AI</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors"
        >
          <Plus size={16} />
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((s) => (
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
        {['ALL', 'ACTIVE', 'PAUSED', 'DRAFT', 'COMPLETED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              filter === f ? 'bg-brand-500 text-white' : 'bg-dark-300 border border-dark-100 text-gray-400 hover:text-white'
            ].join(' ')}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-dark-300 border border-dark-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-100">
                {['Campaign', 'Type', 'Status', 'Audience', 'Open Rate', 'Conversions', 'Steps', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-dark-200 transition-colors group">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-white">{c.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{c.subject}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={['flex items-center gap-1.5 text-xs font-semibold w-fit', c.type === 'EMAIL' ? 'text-blue-400' : 'text-green-400'].join(' ')}>
                      {c.type === 'EMAIL' ? <Mail size={13} /> : <MessageSquare size={13} />}
                      {c.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={['px-2 py-0.5 rounded-full text-xs font-semibold', STATUS_STYLES[c.status]].join(' ')}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Users size={13} />
                      <span>{fmt(c.audience)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-white font-semibold">
                      {c.sent > 0 ? Math.round((c.opened / c.sent) * 100) : 0}%
                    </p>
                    <p className="text-xs text-gray-500">{fmt(c.opened)} opened</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-white font-semibold">{c.converted}</p>
                    <p className="text-xs text-gray-500">
                      {c.audience > 0 ? Math.round((c.converted / c.audience) * 100) : 0}% cvr
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock size={13} />
                      <span>{c.steps} steps</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleStatus(c.id)}
                        className={[
                          'p-1.5 rounded-md transition-colors',
                          c.status === 'ACTIVE'
                            ? 'hover:bg-amber-500/20 hover:text-amber-400 text-gray-500'
                            : 'hover:bg-green-500/20 hover:text-green-400 text-gray-500'
                        ].join(' ')}
                      >
                        {c.status === 'ACTIVE' ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-brand-500/20 hover:text-brand-400 text-gray-500 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteCampaign(c.id)}
                        className="p-1.5 rounded-md hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-dark-100 text-xs text-gray-500">
          Showing {filtered.length} of {campaigns.length} campaigns
        </div>
      </div>

      {showModal && (
        <NewCampaignModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
