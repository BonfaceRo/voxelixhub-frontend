'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, Phone, Mail, Search, Zap, Plus } from 'lucide-react';
import { leadsAPI, messagesAPI, getToken } from '@/lib/api';

interface Message {
  id: string;
  content: string;
  direction: 'INBOUND' | 'OUTBOUND';
  isAI: boolean;
  createdAt: string;
}

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  source: string;
  status: string;
  messages: Message[];
}

const SOURCE_COLORS: Record<string, string> = {
  WHATSAPP:  'text-green-400',
  WEBSITE:   'text-purple-400',
  FACEBOOK:  'text-blue-400',
  INSTAGRAM: 'text-pink-400',
  GOOGLE:    'text-yellow-400',
  MANUAL:    'text-gray-400',
};

const STATUS_COLORS: Record<string, string> = {
  HOT:       'bg-red-500/20 text-red-400',
  WARM:      'bg-amber-500/20 text-amber-400',
  NEW:       'bg-brand-500/20 text-brand-400',
  CONTACTED: 'bg-gray-500/20 text-gray-400',
  CONVERTED: 'bg-green-500/20 text-green-400',
};

export default function InboxPage() {
  const [leads, setLeads]         = useState<Lead[]>([]);
  const [selected, setSelected]   = useState<Lead | null>(null);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [message, setMessage]     = useState('');
  const [search, setSearch]       = useState('');
  const [aiMode, setAiMode]       = useState(true);
  const [loading, setLoading]     = useState(false);
  const [sending, setSending]     = useState(false);
  const [error, setError]         = useState('');
  const messagesEndRef            = useRef<HTMLDivElement>(null);

  const AI_SUGGESTIONS = [
    'Saturday works! We are open 08:00-17:00. Shall I book you for 10 AM?',
    'Would you like me to send our full price list and finance options?',
    'We can arrange a home delivery test drive if more convenient.',
  ];

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await leadsAPI.getAll({ limit: 50 });
      setLeads(data.leads || []);
      if (data.leads?.length > 0) {
        selectLead(data.leads[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectLead = async (lead: Lead) => {
    setSelected(lead);
    try {
      const data = await messagesAPI.getByLead(lead.id);
      setMessages(data.messages || []);
    } catch (err) {
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selected) return;
    setSending(true);
    try {
      if (aiMode) {
        const data = await messagesAPI.aiReply({
          leadId:  selected.id,
          message: message,
          channel: selected.source || 'WHATSAPP',
        });
        setMessages(prev => [
          ...prev,
          {
            id:        Date.now().toString(),
            content:   message,
            direction: 'INBOUND',
            isAI:      false,
            createdAt: new Date().toISOString(),
          },
          {
            id:        data.message.id,
            content:   data.aiResponse,
            direction: 'OUTBOUND',
            isAI:      true,
            createdAt: new Date().toISOString(),
          },
        ]);
      } else {
        const data = await messagesAPI.send({
          leadId:  selected.id,
          content: message,
          channel: selected.source || 'WHATSAPP',
        });
        setMessages(prev => [...prev, {
          id:        data.message.id,
          content:   message,
          direction: 'OUTBOUND',
          isAI:      false,
          createdAt: new Date().toISOString(),
        }]);
      }
      setMessage('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const filtered = leads.filter((l) =>
    !search ||
    `${l.firstName} ${l.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    l.phone?.includes(search)
  );

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], {
      hour:   '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Inbox</h1>
          <p className="text-gray-500 mt-1">
            {leads.length} conversations · Powered by Llama 3.1
          </p>
        </div>
        <div
          onClick={() => setAiMode(!aiMode)}
          className={[
            'flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all',
            aiMode
              ? 'bg-brand-500/10 border-brand-500/30 text-brand-400'
              : 'bg-dark-300 border-dark-100 text-gray-400'
          ].join(' ')}
        >
          <Bot size={16} />
          <span className="text-sm font-semibold">AI {aiMode ? 'ON' : 'OFF'}</span>
          <span className={[
            'w-2 h-2 rounded-full',
            aiMode ? 'bg-brand-400 animate-pulse' : 'bg-gray-600'
          ].join(' ')} />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
          <button onClick={() => setError('')} className="ml-2 underline">dismiss</button>
        </div>
      )}

      <div className="flex gap-4 h-[calc(100vh-220px)]">
        {/* Conversation List */}
        <div className="w-80 shrink-0 bg-dark-300 border border-dark-100 rounded-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-dark-100">
            <div className="flex items-center gap-2 bg-dark-200 rounded-lg px-3 py-2">
              <Search size={14} className="text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="bg-transparent text-sm text-white placeholder:text-gray-500 outline-none flex-1"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-dark-100">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">Add leads to start</p>
              </div>
            ) : (
              filtered.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => selectLead(lead)}
                  className={[
                    'p-4 cursor-pointer hover:bg-dark-200 transition-colors',
                    selected?.id === lead.id
                      ? 'bg-dark-200 border-l-2 border-brand-500'
                      : ''
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {lead.firstName[0]}{lead.lastName?.[0] || ''}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {lead.firstName} {lead.lastName}
                        </p>
                        <p className={['text-xs font-medium', SOURCE_COLORS[lead.source] || 'text-gray-400'].join(' ')}>
                          {lead.source}
                        </p>
                      </div>
                    </div>
                    <span className={['px-1.5 py-0.5 rounded-full text-xs font-semibold', STATUS_COLORS[lead.status] || ''].join(' ')}>
                      {lead.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate ml-10">
                    {lead.phone || lead.email || 'No contact info'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        {selected ? (
          <div className="flex-1 bg-dark-300 border border-dark-100 rounded-xl flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-bold">
                  {selected.firstName[0]}{selected.lastName?.[0] || ''}
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {selected.firstName} {selected.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{selected.phone}</p>
                </div>
                <span className={['px-2 py-0.5 rounded-full text-xs font-semibold ml-2', STATUS_COLORS[selected.status] || ''].join(' ')}>
                  {selected.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-dark-200 text-gray-400 transition-colors">
                  <Phone size={16} />
                </button>
                <button className="p-2 rounded-lg hover:bg-dark-200 text-gray-400 transition-colors">
                  <Mail size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-6 space-y-4"
              style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #12122a 100%)' }}
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Bot size={32} className="mb-3 text-brand-500/50" />
                  <p className="text-sm font-medium">No messages yet</p>
                  <p className="text-xs mt-1">Type a message to start the conversation</p>
                  {aiMode && (
                    <p className="text-xs mt-1 text-brand-400">AI will auto-reply instantly</p>
                  )}
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={['flex items-end gap-2', msg.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'].join(' ')}
                  >
                    {msg.direction === 'INBOUND' && (
                      <div className="w-7 h-7 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {selected.firstName[0]}
                      </div>
                    )}
                    <div className={['max-w-[65%] flex flex-col gap-1', msg.direction === 'OUTBOUND' ? 'items-end' : 'items-start'].join(' ')}>
                      <div className={[
                        'px-4 py-3 rounded-2xl text-sm leading-relaxed',
                        msg.direction === 'OUTBOUND'
                          ? 'bg-brand-500 text-white rounded-br-sm shadow-lg'
                          : 'bg-gray-800 border border-gray-700 text-gray-100 rounded-bl-sm'
                      ].join(' ')}>
                        {msg.content}
                      </div>
                      <div className={['flex items-center gap-1 px-1', msg.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'].join(' ')}>
                        {msg.isAI && (
                          <>
                            <Zap size={10} className="text-accent-500" />
                            <span className="text-xs text-accent-500 font-semibold">AI</span>
                            <span className="text-gray-600 text-xs mx-1">·</span>
                          </>
                        )}
                        <span className="text-xs text-gray-600">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                    {msg.direction === 'OUTBOUND' && (
                      <div className={[
                        'w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0',
                        msg.isAI
                          ? 'bg-accent-500 border-2 border-accent-400'
                          : 'bg-brand-700 border-2 border-brand-500'
                      ].join(' ')}>
                        {msg.isAI ? '⚡' : 'B'}
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* AI Suggestions */}
            {aiMode && (
              <div className="px-6 py-3 border-t border-dark-100 bg-dark-400">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={12} className="text-accent-500" />
                  <span className="text-xs font-semibold text-accent-500">
                    AI Suggestions
                  </span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {AI_SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setMessage(s)}
                      className="shrink-0 px-3 py-1.5 rounded-lg border border-accent-500/30 bg-accent-500/10 text-accent-400 text-xs hover:bg-accent-500/20 transition-colors max-w-xs text-left truncate"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-6 py-4 border-t border-dark-100 bg-dark-300">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !sending && sendMessage()}
                  placeholder={aiMode ? 'Type message — AI will reply automatically...' : 'Type a message...'}
                  className="flex-1 px-4 py-3 rounded-xl border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors"
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim() || sending}
                  className="p-3 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-dark-300 border border-dark-100 rounded-xl flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Bot size={48} className="mx-auto mb-4 text-brand-500/30" />
              <p className="font-semibold text-lg">Select a conversation</p>
              <p className="text-sm mt-1">Choose a lead from the left to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
