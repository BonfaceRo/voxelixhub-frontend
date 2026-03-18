'use client';

import { useState, useEffect } from 'react';
import {
  Users, TrendingUp, MessageSquare, Car,
  ArrowUpRight, ArrowDownRight, Zap, Activity,
  Clock, Star
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const LEAD_TREND = [
  { day: 'Mon', leads: 12, conversions: 4 },
  { day: 'Tue', leads: 19, conversions: 7 },
  { day: 'Wed', leads: 15, conversions: 5 },
  { day: 'Thu', leads: 25, conversions: 10 },
  { day: 'Fri', leads: 32, conversions: 14 },
  { day: 'Sat', leads: 28, conversions: 11 },
  { day: 'Sun', leads: 18, conversions: 6 },
];

const CHANNEL_DATA = [
  { name: 'Website',   value: 40, color: '#6929f5' },
  { name: 'WhatsApp',  value: 30, color: '#25D366' },
  { name: 'Facebook',  value: 20, color: '#1877F2' },
  { name: 'Instagram', value: 10, color: '#E1306C' },
];

const RECENT_LEADS = [
  { id: 1, name: 'Thabo Nkosi',   source: 'WhatsApp', status: 'HOT',  time: '5m ago',  interest: 'BMW X5' },
  { id: 2, name: 'Priya Pillay',  source: 'Website',  status: 'WARM', time: '22m ago', interest: 'Toyota Hilux' },
  { id: 3, name: 'James van Wyk', source: 'Facebook', status: 'NEW',  time: '1h ago',  interest: 'VW Polo' },
  { id: 4, name: 'Nomsa Dlamini', source: 'Website',  status: 'WARM', time: '2h ago',  interest: 'Honda CRV' },
  { id: 5, name: 'Ruan Botha',    source: 'Instagram',status: 'NEW',  time: '3h ago',  interest: 'Ford Ranger' },
];

const AI_ACTIVITY = [
  { text: 'Auto-replied to Thabo Nkosi on WhatsApp',  time: '5m ago' },
  { text: 'Sent follow-up SMS to 8 warm leads',        time: '30m ago' },
  { text: 'Scored 3 new leads as HOT',                 time: '1h ago' },
  { text: 'Generated ad copy for Facebook campaign',   time: '2h ago' },
];

const STATUS_COLORS: Record<string, string> = {
  HOT:  'bg-red-500/20 text-red-400',
  WARM: 'bg-amber-500/20 text-amber-400',
  NEW:  'bg-brand-500/20 text-brand-400',
};

const SOURCE_COLORS: Record<string, string> = {
  WhatsApp:  'bg-green-500/20 text-green-400',
  Website:   'bg-purple-500/20 text-purple-400',
  Facebook:  'bg-blue-500/20 text-blue-400',
  Instagram: 'bg-pink-500/20 text-pink-400',
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function StatCard({ icon: Icon, label, value, trend, color }: {
  icon: any; label: string; value: string; trend: number; color: string;
}) {
  const up = trend >= 0;
  return (
    <div className="bg-dark-300 border border-dark-100 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold ${up ? 'text-green-400' : 'text-red-400'}`}>
          {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </span>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('');
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    setGreeting(getGreeting());
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      setUserName(parsed.firstName || '');
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting}{userName ? `, ${userName}!` : '!'} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here is what is happening at your business today.</p>
        </div>
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d'] as const).map(r => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeRange === r
                  ? 'bg-brand-500 text-white'
                  : 'bg-dark-300 border border-dark-100 text-gray-400 hover:text-white'
              }`}
            >
              {r}u
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users}        label="Total Leads"      value="284"   trend={12}   color="bg-brand-500/20 text-brand-400" />
        <StatCard icon={TrendingUp}   label="Conversion Rate"  value="18.4%" trend={3.2}  color="bg-green-500/20 text-green-400" />
        <StatCard icon={MessageSquare}label="AI Replies Sent"  value="147"   trend={8.1}  color="bg-amber-500/20 text-amber-400" />
        <StatCard icon={Car}          label="Appointments"     value="23"    trend={-2.1} color="bg-blue-500/20 text-blue-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-dark-300 border border-dark-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white">Lead Volume This Week</h3>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-brand-500 inline-block" />Leads</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-accent-500 inline-block" />Conversions</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={LEAD_TREND}>
              <defs>
                <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#6929f5" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6929f5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#f5a623" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f5a623" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#8b8fd8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#8b8fd8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #2a2a4a', background: '#12122a', color: '#fff', fontSize: '12px' }} />
              <Area type="monotone" dataKey="leads"       stroke="#6929f5" fill="url(#leadsGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="conversions" stroke="#f5a623" fill="url(#convGrad)"  strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dark-300 border border-dark-100 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-6">Lead Sources</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={CHANNEL_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {CHANNEL_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #2a2a4a', background: '#12122a', color: '#fff', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {CHANNEL_DATA.map(c => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-gray-400">{c.name}</span>
                </div>
                <span className="font-semibold text-white">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-dark-300 border border-dark-100 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-dark-100">
            <h3 className="font-semibold text-white">Recent Leads</h3>
            <a href="/dashboard/leads" className="text-sm text-brand-400 hover:text-brand-300 font-medium">View All →</a>
          </div>
          <div className="divide-y divide-dark-100">
            {RECENT_LEADS.map(lead => (
              <div key={lead.id} className="flex items-center justify-between px-6 py-4 hover:bg-dark-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.interest}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${SOURCE_COLORS[lead.source]}`}>{lead.source}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[lead.status]}`}>{lead.status}</span>
                  <span className="text-xs text-gray-500">{lead.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dark-300 border border-dark-100 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-dark-100">
            <div className="w-6 h-6 rounded-md bg-brand-500/20 flex items-center justify-center">
              <Zap size={12} className="text-brand-400" />
            </div>
            <h3 className="font-semibold text-white">AI Activity</h3>
          </div>
          <div className="p-4 space-y-3">
            {AI_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-dark-200">
                <div className="w-2 h-2 rounded-full bg-brand-400 mt-1.5 shrink-0 animate-pulse" />
                <div>
                  <p className="text-xs text-gray-300 leading-relaxed">{item.text}</p>
                  <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                    <Clock size={10} />{item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-brand-500/10 border border-brand-500/20">
              <div>
                <p className="text-xs font-bold text-brand-300">AI Working 24/7</p>
                <p className="text-xs text-brand-400/70">147 auto-replies this week</p>
              </div>
              <div className="flex gap-1">
                {[1,2,3].map(d => (
                  <div key={d} className="typing-dot w-2 h-2 rounded-full bg-brand-400" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
