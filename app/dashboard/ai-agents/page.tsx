'use client';

import { useState } from 'react';
import { Bot, Zap, TrendingUp, Target, RefreshCw, Play, Pause, Settings, Sparkles, Copy, Check } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://voxelixhub-backend.onrender.com';
function getToken() { return localStorage.getItem('token') || ''; }
async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, ...(options.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

const MOCK_AGENTS = [
  { id: '1', name: 'Lead Scoring AI',    description: 'Automatically scores every lead 0-100 based on behavior and engagement.',  status: 'ACTIVE', triggered: 284, converted: 23, lastRun: '2 mins ago',  icon: '🎯' },
  { id: '2', name: 'Hot Lead Detector',  description: 'Monitors activity and alerts your team when a lead shows buying signals.',   status: 'ACTIVE', triggered: 54,  converted: 18, lastRun: '5 mins ago',  icon: '🔥' },
  { id: '3', name: 'Re-engagement AI',   description: 'Contacts cold leads that have not responded in 7+ days automatically.',     status: 'ACTIVE', triggered: 89,  converted: 12, lastRun: '1 hour ago',  icon: '💬' },
  { id: '4', name: 'Campaign Optimizer', description: 'Analyzes performance and adjusts send times and content automatically.',     status: 'PAUSED', triggered: 12,  converted: 5,  lastRun: '2 days ago',  icon: '📈' },
  { id: '5', name: 'Predictive ROI',     description: 'Predicts which leads are most likely to convert and estimates revenue.',     status: 'ACTIVE', triggered: 145, converted: 34, lastRun: '30 mins ago', icon: '💰' },
  { id: '6', name: 'Cross-Platform AI',  description: 'Generates and schedules AI content across Facebook, Instagram, WhatsApp.',  status: 'PAUSED', triggered: 8,   converted: 2,  lastRun: '3 days ago',  icon: '📱' },
];

const HOT_LEADS = [
  { name: 'Thabo Nkosi',    score: 94, reason: 'Viewed BMW X5 page 4 times today',     action: 'Call Now'   },
  { name: 'Pieter du P',    score: 88, reason: 'Finance pre-approval completed',        action: 'Call Now'   },
  { name: 'Zanele Mokoena', score: 82, reason: 'Replied to 3 messages in last hour',    action: 'Message'    },
  { name: 'Priya Pillay',   score: 76, reason: 'Requested Saturday test drive booking', action: 'Book Drive' },
];

const BUSINESS_TYPES = [
  { value: 'car_dealership', label: 'Car dealership' },
  { value: 'restaurant',     label: 'Restaurant'     },
  { value: 'real_estate',    label: 'Real estate'    },
  { value: 'gym',            label: 'Gym'            },
  { value: 'salon',          label: 'Salon'          },
  { value: 'general',        label: 'General'        },
];

const PLATFORMS = ['facebook', 'instagram', 'whatsapp', 'sms', 'email'];
const TONES     = ['professional', 'friendly', 'urgent', 'playful', 'luxury'];

interface CopyResult {
  headline: string;
  copies: Record<string, string>;
  callToAction: string;
  tips: string[];
}

function CopyCard({ platform, text }: { platform: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-dark-200 border border-dark-100 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-brand-400 uppercase tracking-wide">{platform}</span>
        <button onClick={copy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
          {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );
}

function AdCopyGenerator() {
  const [form, setForm] = useState({ businessType: 'car_dealership', goal: '', productOrService: '', tone: 'professional', platforms: ['facebook', 'instagram', 'whatsapp'] });
  const [result, setResult] = useState<CopyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const togglePlatform = (p: string) => {
    setForm(f => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter(x => x !== p) : [...f.platforms, p],
    }));
  };

  const generate = async () => {
    if (!form.goal) { setError('Please describe your goal'); return; }
    if (form.platforms.length === 0) { setError('Select at least one platform'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await apiFetch('/v1/ai/generate-copy', { method: 'POST', body: JSON.stringify(form) });
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="bg-dark-300 border border-dark-100 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-5 flex items-center gap-2"><Sparkles size={16} className="text-brand-400" /> Generate ad copy</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Business type</label>
            <select className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none"
              value={form.businessType} onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))}>
              {BUSINESS_TYPES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Campaign goal *</label>
            <input className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors"
              value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}
              placeholder="e.g. Promote March car sale, Get gym signups" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Product or service (optional)</label>
            <input className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors"
              value={form.productOrService} onChange={e => setForm(f => ({ ...f, productOrService: e.target.value }))}
              placeholder="e.g. 2023 Toyota Hilux, Monthly gym membership" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, tone: t }))}
                  className={['px-3 py-1 rounded-lg text-xs font-semibold transition-all capitalize',
                    form.tone === t ? 'bg-brand-500 text-white' : 'bg-dark-200 border border-dark-100 text-gray-400 hover:text-white'].join(' ')}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Platforms</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => togglePlatform(p)}
                  className={['px-3 py-1 rounded-lg text-xs font-semibold transition-all capitalize',
                    form.platforms.includes(p) ? 'bg-brand-500/20 border border-brand-500/50 text-brand-400' : 'bg-dark-200 border border-dark-100 text-gray-400 hover:text-white'].join(' ')}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button onClick={generate} disabled={loading || !form.goal}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors disabled:opacity-40">
            <Sparkles size={15} />
            {loading ? 'Generating with AI...' : 'Generate copy'}
          </button>
        </div>
      </div>

      <div>
        {loading && (
          <div className="bg-dark-300 border border-dark-100 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-gray-400">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">AI is writing your copy...</p>
          </div>
        )}
        {result && (
          <div className="space-y-4">
            <div className="bg-dark-300 border border-brand-500/30 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Headline</p>
              <p className="text-white font-semibold">{result.headline}</p>
              <p className="text-xs text-brand-400 mt-2">CTA: {result.callToAction}</p>
            </div>
            {Object.entries(result.copies).map(([platform, text]) => (
              <CopyCard key={platform} platform={platform} text={text} />
            ))}
            {result.tips?.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-400 mb-1">AI tip</p>
                <p className="text-xs text-gray-300">{result.tips[0]}</p>
              </div>
            )}
          </div>
        )}
        {!loading && !result && (
          <div className="bg-dark-300 border border-dark-100 rounded-xl p-8 flex flex-col items-center justify-center gap-2 text-gray-500 h-full min-h-64">
            <Sparkles size={28} className="opacity-30" />
            <p className="text-sm font-medium">Your generated copy will appear here</p>
            <p className="text-xs">Fill in the form and click Generate</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AIAgentsPage() {
  const [agents, setAgents] = useState(MOCK_AGENTS);
  const [tab, setTab]       = useState<'agents' | 'adcopy'>('agents');

  const toggleAgent = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : a));
  };

  const activeCount    = agents.filter(a => a.status === 'ACTIVE').length;
  const totalTriggered = agents.reduce((s, a) => s + a.triggered, 0);
  const totalConverted = agents.reduce((s, a) => s + a.converted, 0);

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Growth Agents</h1>
          <p className="text-gray-500 mt-1">Autonomous AI working 24/7 to grow your business</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500/10 border border-brand-500/30">
          <Bot size={16} className="text-brand-400" />
          <span className="text-sm font-semibold text-brand-400">{activeCount} Agents Active</span>
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active agents',   value: String(activeCount),    color: 'text-brand-400', bg: 'bg-brand-500/20', icon: Bot        },
          { label: 'Total triggered', value: String(totalTriggered), color: 'text-amber-400', bg: 'bg-amber-500/20', icon: Zap        },
          { label: 'Conversions',     value: String(totalConverted), color: 'text-green-400', bg: 'bg-green-500/20', icon: TrendingUp },
          { label: 'Hot leads now',   value: String(HOT_LEADS.length), color: 'text-red-400', bg: 'bg-red-500/20',  icon: Target     },
        ].map(s => (
          <div key={s.label} className="bg-dark-300 border border-dark-100 rounded-xl p-5">
            <div className={['w-9 h-9 rounded-xl flex items-center justify-center mb-3', s.bg, s.color].join(' ')}>
              <s.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        {([['agents', 'AI Agents'], ['adcopy', 'Ad Copy Generator']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={['px-4 py-2 rounded-lg text-sm font-semibold transition-all',
              tab === key ? 'bg-brand-500 text-white' : 'bg-dark-300 border border-dark-100 text-gray-400 hover:text-white'].join(' ')}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'adcopy' ? <AdCopyGenerator /> : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map(agent => (
              <div key={agent.id} className="bg-dark-300 border border-dark-100 rounded-xl p-6 hover:border-brand-500/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-dark-200 flex items-center justify-center text-2xl">{agent.icon}</div>
                    <div>
                      <h3 className="font-semibold text-white">{agent.name}</h3>
                      <span className={['text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block',
                        agent.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'].join(' ')}>
                        {agent.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-dark-200 text-gray-400 transition-colors"><Settings size={15} /></button>
                    <button onClick={() => toggleAgent(agent.id)}
                      className={['p-1.5 rounded-lg transition-colors',
                        agent.status === 'ACTIVE' ? 'hover:bg-amber-500/20 hover:text-amber-400 text-gray-400' : 'hover:bg-green-500/20 hover:text-green-400 text-gray-400'].join(' ')}>
                      {agent.status === 'ACTIVE' ? <Pause size={15} /> : <Play size={15} />}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-5">{agent.description}</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[['Triggered', agent.triggered, 'text-white'], ['Converted', agent.converted, 'text-green-400'], [
                    'CVR', (agent.triggered > 0 ? Math.round((agent.converted / agent.triggered) * 100) : 0) + '%', 'text-brand-400']
                  ].map(([label, val, color]) => (
                    <div key={String(label)} className="text-center p-3 rounded-lg bg-dark-200">
                      <p className={['text-lg font-bold', color].join(' ')}>{val}</p>
                      <p className="text-xs text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <RefreshCw size={11} />Last run: {agent.lastRun}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-dark-300 border border-dark-100 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-dark-100">
                <div className="w-6 h-6 rounded-md bg-red-500/20 flex items-center justify-center">
                  <Target size={13} className="text-red-400" />
                </div>
                <h3 className="font-semibold text-white">Hot leads right now</h3>
              </div>
              <div className="divide-y divide-dark-100">
                {HOT_LEADS.map((lead, i) => (
                  <div key={i} className="p-4 hover:bg-dark-200 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <p className="text-sm font-semibold text-white">{lead.name}</p>
                      </div>
                      <span className="text-xs font-bold text-red-400">{lead.score}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2 ml-9">{lead.reason}</p>
                    <div className="ml-9">
                      <button className="px-3 py-1 rounded-lg bg-brand-500/20 text-brand-400 text-xs font-semibold hover:bg-brand-500/30 transition-colors">
                        {lead.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
