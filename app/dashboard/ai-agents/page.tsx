'use client';

import { useState } from 'react';
import { Bot, Zap, TrendingUp, Users, RefreshCw, Target, Play, Pause, Settings } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'PAUSED';
  type: string;
  triggered: number;
  converted: number;
  lastRun: string;
  icon: string;
}

const MOCK_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Lead Scoring AI',
    description: 'Automatically scores every lead 0-100 based on behavior, source, and engagement patterns.',
    status: 'ACTIVE',
    type: 'SCORING',
    triggered: 284,
    converted: 23,
    lastRun: '2 mins ago',
    icon: '🎯',
  },
  {
    id: '2',
    name: 'Hot Lead Detector',
    description: 'Monitors lead activity and instantly alerts your team when a lead shows buying signals.',
    status: 'ACTIVE',
    type: 'DETECTION',
    triggered: 54,
    converted: 18,
    lastRun: '5 mins ago',
    icon: '🔥',
  },
  {
    id: '3',
    name: 'Re-engagement AI',
    description: 'Automatically contacts cold leads that have not responded in 7+ days with personalized messages.',
    status: 'ACTIVE',
    type: 'REENGAGEMENT',
    triggered: 89,
    converted: 12,
    lastRun: '1 hour ago',
    icon: '💬',
  },
  {
    id: '4',
    name: 'Campaign Optimizer',
    description: 'Analyzes campaign performance and automatically adjusts send times and content for better results.',
    status: 'PAUSED',
    type: 'OPTIMIZATION',
    triggered: 12,
    converted: 5,
    lastRun: '2 days ago',
    icon: '📈',
  },
  {
    id: '5',
    name: 'Predictive ROI',
    description: 'Predicts which leads are most likely to convert and estimates revenue potential for each prospect.',
    status: 'ACTIVE',
    type: 'PREDICTION',
    triggered: 145,
    converted: 34,
    lastRun: '30 mins ago',
    icon: '💰',
  },
  {
    id: '6',
    name: 'Cross-Platform Poster',
    description: 'Automatically generates and posts AI content across Facebook, Instagram, and WhatsApp status.',
    status: 'PAUSED',
    type: 'SOCIAL',
    triggered: 8,
    converted: 2,
    lastRun: '3 days ago',
    icon: '📱',
  },
];

const HOT_LEADS = [
  { name: 'Thabo Nkosi',   score: 94, reason: 'Viewed BMW X5 page 4 times today',        action: 'Call Now'    },
  { name: 'Pieter du P',   score: 88, reason: 'Finance pre-approval completed',           action: 'Call Now'    },
  { name: 'Zanele Mokoena',score: 82, reason: 'Replied to 3 messages in last hour',       action: 'Message'     },
  { name: 'Priya Pillay',  score: 76, reason: 'Requested Saturday test drive booking',    action: 'Book Drive'  },
];

const AI_LOG = [
  { time: '2 mins ago',  agent: 'Lead Scoring AI',    action: 'Scored Thabo Nkosi as 94/100 — HOT',           color: 'text-red-400'    },
  { time: '5 mins ago',  agent: 'Hot Lead Detector',  action: 'Alert sent to team for Pieter du Plessis',      color: 'text-amber-400'  },
  { time: '18 mins ago', agent: 'Re-engagement AI',   action: 'Sent re-engagement SMS to 8 cold leads',        color: 'text-brand-400'  },
  { time: '30 mins ago', agent: 'Predictive ROI',     action: 'Predicted R145,000 revenue from current leads', color: 'text-green-400'  },
  { time: '1 hour ago',  agent: 'Re-engagement AI',   action: '2 cold leads responded after re-engagement',    color: 'text-green-400'  },
  { time: '2 hours ago', agent: 'Lead Scoring AI',    action: 'Rescored 45 leads after campaign interaction',  color: 'text-brand-400'  },
];

function AgentCard({ agent, onToggle }: { agent: Agent; onToggle: (id: string) => void }) {
  const convRate = agent.triggered > 0 ? Math.round((agent.converted / agent.triggered) * 100) : 0;

  return (
    <div className="bg-dark-300 border border-dark-100 rounded-xl p-6 hover:border-brand-500/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-dark-200 flex items-center justify-center text-2xl">
            {agent.icon}
          </div>
          <div>
            <h3 className="font-semibold text-white">{agent.name}</h3>
            <span className={[
              'text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block',
              agent.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
            ].join(' ')}>
              {agent.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg hover:bg-dark-200 text-gray-400 transition-colors">
            <Settings size={15} />
          </button>
          <button
            onClick={() => onToggle(agent.id)}
            className={[
              'p-1.5 rounded-lg transition-colors',
              agent.status === 'ACTIVE'
                ? 'hover:bg-amber-500/20 hover:text-amber-400 text-gray-400'
                : 'hover:bg-green-500/20 hover:text-green-400 text-gray-400'
            ].join(' ')}
          >
            {agent.status === 'ACTIVE' ? <Pause size={15} /> : <Play size={15} />}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-400 leading-relaxed mb-5">{agent.description}</p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-lg bg-dark-200">
          <p className="text-lg font-bold text-white">{agent.triggered}</p>
          <p className="text-xs text-gray-500">Triggered</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-dark-200">
          <p className="text-lg font-bold text-green-400">{agent.converted}</p>
          <p className="text-xs text-gray-500">Converted</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-dark-200">
          <p className="text-lg font-bold text-brand-400">{convRate}%</p>
          <p className="text-xs text-gray-500">CVR</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <RefreshCw size={11} />
        Last run: {agent.lastRun}
      </div>
    </div>
  );
}

export default function AIAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);

  const toggleAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' }
          : a
      )
    );
  };

  const activeCount = agents.filter((a) => a.status === 'ACTIVE').length;
  const totalTriggered = agents.reduce((s, a) => s + a.triggered, 0);
  const totalConverted = agents.reduce((s, a) => s + a.converted, 0);

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Growth Agents</h1>
          <p className="text-gray-500 mt-1">Autonomous AI agents working 24/7 to grow your business</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500/10 border border-brand-500/30">
          <Bot size={16} className="text-brand-400" />
          <span className="text-sm font-semibold text-brand-400">{activeCount} Agents Active</span>
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Agents',   value: String(activeCount),         color: 'text-brand-400',  bg: 'bg-brand-500/20',  icon: Bot        },
          { label: 'Total Triggered', value: String(totalTriggered),      color: 'text-amber-400',  bg: 'bg-amber-500/20',  icon: Zap        },
          { label: 'Conversions',     value: String(totalConverted),      color: 'text-green-400',  bg: 'bg-green-500/20',  icon: TrendingUp },
          { label: 'Hot Leads Now',   value: String(HOT_LEADS.length),    color: 'text-red-400',    bg: 'bg-red-500/20',    icon: Target     },
        ].map((s) => (
          <div key={s.label} className="bg-dark-300 border border-dark-100 rounded-xl p-5">
            <div className={['w-9 h-9 rounded-xl flex items-center justify-center mb-3', s.bg, s.color].join(' ')}>
              <s.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Your AI Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onToggle={toggleAgent} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-dark-300 border border-dark-100 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-dark-100">
              <div className="w-6 h-6 rounded-md bg-red-500/20 flex items-center justify-center">
                <Target size={13} className="text-red-400" />
              </div>
              <h3 className="font-semibold text-white">Hot Leads Right Now</h3>
            </div>
            <div className="divide-y divide-dark-100">
              {HOT_LEADS.map((lead, i) => (
                <div key={i} className="p-4 hover:bg-dark-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
                        {lead.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <p className="text-sm font-semibold text-white">{lead.name}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-red-400">{lead.score}</span>
                      </div>
                    </div>
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

          <div className="bg-dark-300 border border-dark-100 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-dark-100">
              <div className="w-6 h-6 rounded-md bg-brand-500/20 flex items-center justify-center">
                <Zap size={13} className="text-brand-400" />
              </div>
              <h3 className="font-semibold text-white">AI Activity Log</h3>
            </div>
            <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
              {AI_LOG.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0 animate-pulse" />
                  <div>
                    <p className="text-xs text-gray-300">{log.action}</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      <span className={log.color}>{log.agent}</span> · {log.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
