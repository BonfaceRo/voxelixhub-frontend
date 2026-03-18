'use client';

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, MousePointer, Zap } from 'lucide-react';

const MONTHLY_REVENUE = [
  { month: 'Oct', revenue: 180000, leads: 89 },
  { month: 'Nov', revenue: 220000, leads: 112 },
  { month: 'Dec', revenue: 195000, leads: 98 },
  { month: 'Jan', revenue: 280000, leads: 145 },
  { month: 'Feb', revenue: 310000, leads: 167 },
  { month: 'Mar', revenue: 345000, leads: 189 },
];

const CHANNEL_DATA = [
  { channel: 'Website',   leads: 89, revenue: 145000 },
  { channel: 'WhatsApp',  leads: 67, revenue: 112000 },
  { channel: 'Facebook',  leads: 45, revenue: 78000  },
  { channel: 'Instagram', leads: 28, revenue: 45000  },
];

const FUNNEL = [
  { name: 'Leads Captured', value: 284, color: '#6929f5' },
  { name: 'Contacted',      value: 198, color: '#8456ff' },
  { name: 'Warm Prospects', value: 112, color: '#f5a623' },
  { name: 'Hot Leads',      value: 54,  color: '#ff6b35' },
  { name: 'Converted',      value: 23,  color: '#10b981' },
];

const CAMPAIGN_PERF = [
  { name: 'Welcome',   open: 78, click: 34, conv: 12 },
  { name: 'Follow-up', open: 64, click: 28, conv: 18 },
  { name: 'Re-engage', open: 42, click: 15, conv: 6  },
  { name: 'Promo',     open: 71, click: 45, conv: 22 },
];

const AI_INSIGHTS = [
  { text: 'WhatsApp leads convert 3x better than Facebook. Increase WhatsApp capture to add R42,000/mo in revenue.', confidence: 87 },
  { text: '12 leads have not been contacted in 7 days. A re-engagement SMS could recover 3-5 of them.', confidence: 74 },
  { text: 'Tuesday 10AM emails have 28% higher open rates. Reschedule your next campaign to Tuesday morning.', confidence: 91 },
  { text: '3 leads scored above 85 show similar patterns to your top customers. Call them within 24 hours.', confidence: 83 },
];

function fmt(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function AnalyticsPage() {
  const [range, setRange] = useState('30d');

  const KPIS = [
    { label: 'Monthly Revenue',  value: 'R345,000', trend: 14.2,  icon: DollarSign,   color: 'text-green-400',  bg: 'bg-green-500/20',  up: true  },
    { label: 'Lead-to-Close',    value: '8.1%',     trend: 1.8,   icon: TrendingUp,   color: 'text-brand-400',  bg: 'bg-brand-500/20',  up: true  },
    { label: 'Cost per Lead',    value: 'R42',      trend: 8.3,   icon: MousePointer, color: 'text-amber-400',  bg: 'bg-amber-500/20',  up: false },
    { label: 'Active Prospects', value: '112',      trend: 22.1,  icon: Users,        color: 'text-purple-400', bg: 'bg-purple-500/20', up: true  },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-500 mt-1">Full-funnel performance across all channels</p>
        </div>
        <div className="flex items-center gap-2">
          {['7d', '30d', '90d'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                range === r ? 'bg-brand-500 text-white' : 'bg-dark-300 border border-dark-100 text-gray-400 hover:text-white'
              ].join(' ')}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {KPIS.map((k) => (
          <div key={k.label} className="bg-dark-300 border border-dark-100 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={['w-10 h-10 rounded-xl flex items-center justify-center', k.bg, k.color].join(' ')}>
                <k.icon size={20} />
              </div>
              <span className={['flex items-center gap-1 text-xs font-semibold', k.up ? 'text-green-400' : 'text-red-400'].join(' ')}>
                {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {k.trend}%
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-sm text-gray-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-dark-300 border border-dark-100 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-6">Revenue and Lead Volume</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MONTHLY_REVENUE}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#6929f5" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6929f5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8b8fd8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8b8fd8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => 'R' + Math.round(Number(v) / 1000) + 'k'} />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: '1px solid #2a2a4a', background: '#12122a', color: '#fff', fontSize: '12px' }}
                formatter={(v: any, name: any) => [name === 'revenue' ? 'R' + fmt(Number(v)) : v, name]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revGrad)" strokeWidth={2} name="revenue" />
              <Area type="monotone" dataKey="leads"   stroke="#6929f5" fill="url(#leadGrad)" strokeWidth={2} name="leads" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dark-300 border border-dark-100 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-6">Conversion Funnel</h3>
          <div className="space-y-3">
            {FUNNEL.map((f, i) => (
              <div key={f.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{f.name}</span>
                  <span className="font-semibold text-white">{f.value}</span>
                </div>
                <div className="h-6 rounded-lg overflow-hidden bg-dark-200">
                  <div
                    className="h-full rounded-lg flex items-center justify-end pr-2 transition-all"
                    style={{
                      width: (f.value / FUNNEL[0].value * 100) + '%',
                      background: f.color,
                    }}
                  >
                    {i > 0 && (
                      <span className="text-white text-xs font-semibold">
                        {Math.round(f.value / FUNNEL[i - 1].value * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Overall conversion: {Math.round(FUNNEL[4].value / FUNNEL[0].value * 100)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-dark-300 border border-dark-100 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-6">Channel Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CHANNEL_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#8b8fd8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => 'R' + Math.round(Number(v) / 1000) + 'k'} />
              <YAxis dataKey="channel" type="category" tick={{ fontSize: 12, fill: '#8b8fd8' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: '1px solid #2a2a4a', background: '#12122a', color: '#fff', fontSize: '12px' }}
                formatter={(v: any) => ['R' + fmt(Number(v)), 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#6929f5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dark-300 border border-dark-100 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-6">Campaign Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CAMPAIGN_PERF}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8b8fd8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8b8fd8' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: '1px solid #2a2a4a', background: '#12122a', color: '#fff', fontSize: '12px' }}
                formatter={(v: any) => [v + '%', '']}
              />
              <Bar dataKey="open"  name="Open"  fill="#6929f5" radius={[3, 3, 0, 0]} />
              <Bar dataKey="click" name="Click" fill="#f5a623" radius={[3, 3, 0, 0]} />
              <Bar dataKey="conv"  name="Conv"  fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-dark-300 border border-dark-100 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center">
            <Zap size={16} className="text-accent-500" />
          </div>
          <h3 className="font-semibold text-white">AI Growth Advisor</h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-accent-500/20 text-accent-400 ml-auto">
            4 insights
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
                    <div
                      className="h-full bg-accent-500 rounded-full"
                      style={{ width: ins.confidence + '%' }}
                    />
                  </div>
                  <span className="text-xs text-accent-400 font-semibold">{ins.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
