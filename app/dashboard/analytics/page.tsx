'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, DollarSign, Users, Mail, MessageSquare, Zap, RefreshCw } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://voxelixhub-backend.onrender.com';
function getToken() { return localStorage.getItem('token') || ''; }
async function apiFetch(path: string) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

const tooltipStyle = {
  borderRadius: '10px',
  border: '1px solid #2a2a4a',
  background: '#12122a',
  color: '#fff',
  fontSize: '12px',
};

const AI_INSIGHTS = [
  { text: 'Follow up with leads that have not been contacted in 7+ days — a re-engagement SMS could recover 20-30% of them.', confidence: 87 },
  { text: 'Email campaigns with personalised subject lines get 3x higher open rates. Use [First Name] in your next campaign.', confidence: 91 },
  { text: 'Leads that receive a follow-up within 5 minutes are 9x more likely to convert. Enable AI auto-reply to close this gap.', confidence: 83 },
  { text: 'SMS campaigns have 90%+ open rates vs 20% for email. Prioritise SMS for time-sensitive promotions.', confidence: 78 },
];

export default function AnalyticsPage() {
  const [range, setRange]     = useState('30');
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetch = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await apiFetch(`/v1/analytics/summary?days=${range}`);
      setData(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => { fetch(); }, [fetch]);

  const summary = data?.summary || {};

  const KPIS = [
    { label: 'Total leads',      value: String(summary.totalLeads || 0),         icon: Users,          color: 'text-brand-400',  bg: 'bg-brand-500/20'  },
    { label: 'Converted',        value: String(summary.convertedLeads || 0),      icon: TrendingUp,     color: 'text-green-400',  bg: 'bg-green-500/20'  },
    { label: 'Emails sent',      value: String(summary.totalEmailsSent || 0),     icon: Mail,           color: 'text-blue-400',   bg: 'bg-blue-500/20'   },
    { label: 'SMS sent',         value: String(summary.totalSmsSent || 0),        icon: MessageSquare,  color: 'text-amber-400',  bg: 'bg-amber-500/20'  },
    { label: 'Email open rate',  value: (summary.emailOpenRate || '0') + '%',     icon: DollarSign,     color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { label: 'Conversion rate',  value: (summary.conversionRate || '0') + '%',    icon: TrendingUp,     color: 'text-teal-400',   bg: 'bg-teal-500/20'   },
    { label: 'AI copy generated',value: String(summary.totalAiCopy || 0),         icon: Zap,            color: 'text-pink-400',   bg: 'bg-pink-500/20'   },
    { label: 'Active campaigns', value: String(summary.activeCampaigns || 0),     icon: Mail,           color: 'text-coral-400',  bg: 'bg-coral-500/20'  },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-500 mt-1">Real-time performance across all channels</p>
        </div>
        <div className="flex items-center gap-2">
          {[['7', '7d'], ['30', '30d'], ['90', '90d']].map(([val, label]) => (
            <button key={val} onClick={() => setRange(val)}
              className={['px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                range === val ? 'bg-brand-500 text-white' : 'bg-dark-300 border border-dark-100 text-gray-400 hover:text-white'].join(' ')}>
              {label}
            </button>
          ))}
          <button onClick={fetch} className="p-2 rounded-lg border border-dark-100 text-gray-400 hover:text-white transition-colors">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-500">Loading analytics...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {KPIS.slice(0, 4).map(k => (
              <div key={k.label} className="bg-dark-300 border border-dark-100 rounded-xl p-5">
                <div className={['w-10 h-10 rounded-xl flex items-center justify-center mb-3', k.bg, k.color].join(' ')}>
                  <k.icon size={20} />
                </div>
                <p className="text-2xl font-bold text-white">{k.value}</p>
                <p className="text-sm text-gray-500 mt-1">{k.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {KPIS.slice(4).map(k => (
              <div key={k.label} className="bg-dark-300 border border-dark-100 rounded-xl p-5">
                <div className={['w-10 h-10 rounded-xl flex items-center justify-center mb-3', k.bg, k.color].join(' ')}>
                  <k.icon size={20} />
                </div>
                <p className="text-2xl font-bold text-white">{k.value}</p>
                <p className="text-sm text-gray-500 mt-1">{k.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-dark-300 border border-dark-100 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-6">Lead volume over time</h3>
              {data?.leadsByDay?.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={data.leadsByDay}>
                    <defs>
                      <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#6929f5" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#6929f5" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8b8fd8' }} axisLine={false} tickLine={false}
                      tickFormatter={v => v.split('-').slice(1).join('/')} />
                    <YAxis tick={{ fontSize: 11, fill: '#8b8fd8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="count" name="Leads" stroke="#6929f5" fill="url(#leadGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-500 text-sm">No lead data yet for this period</div>
              )}
            </div>

            <div className="bg-dark-300 border border-dark-100 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-6">Leads by status</h3>
              {data?.leadsByStatus?.length > 0 ? (
                <div className="space-y-3">
                  {data.leadsByStatus.map((s: any) => {
                    const total = data.leadsByStatus.reduce((a: number, x: any) => a + x.count, 0);
                    const pct   = total > 0 ? Math.round((s.count / total) * 100) : 0;
                    return (
                      <div key={s.status}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">{s.status}</span>
                          <span className="font-semibold text-white">{s.count}</span>
                        </div>
                        <div className="h-5 rounded-lg overflow-hidden bg-dark-200">
                          <div className="h-full rounded-lg bg-brand-500 transition-all" style={{ width: pct + '%' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-500 text-sm">No data yet</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-dark-300 border border-dark-100 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-6">Leads by source</h3>
              {data?.leadsBySource?.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.leadsBySource} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#8b8fd8' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="source" type="category" tick={{ fontSize: 12, fill: '#8b8fd8' }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" name="Leads" fill="#6929f5" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-500 text-sm">No source data yet</div>
              )}
            </div>

            <div className="bg-dark-300 border border-dark-100 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-6">Campaign enrollments</h3>
              {data?.campaigns?.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.campaigns}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8b8fd8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#8b8fd8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="enrollments" name="Enrollments" fill="#10b981" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-500 text-sm">No campaign data yet</div>
              )}
            </div>
          </div>

          <div className="bg-dark-300 border border-dark-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center">
                <Zap size={16} className="text-accent-500" />
              </div>
              <h3 className="font-semibold text-white">AI Growth Advisor</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-accent-500/20 text-accent-400 ml-auto">
                {AI_INSIGHTS.length} insights
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AI_INSIGHTS.map((ins, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-accent-500/20 bg-accent-500/5">
                  <div className="w-7 h-7 rounded-lg bg-accent-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap size={13} className="text-accent-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300 leading-relaxed">{ins.text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-dark-100 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-500 rounded-full" style={{ width: ins.confidence + '%' }} />
                      </div>
                      <span className="text-xs text-accent-400 font-semibold">{ins.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
