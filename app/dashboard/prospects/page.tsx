'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, Send, Users, CheckCircle, XCircle, RefreshCw, Zap, Plus, Trash2, UserPlus } from 'lucide-react';

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

interface Prospect {
  id: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  email?: string;
  status: string;
  sentAt?: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING:      'bg-gray-500/20 text-gray-400',
  SENT:         'bg-blue-500/20 text-blue-400',
  REPLIED:      'bg-amber-500/20 text-amber-400',
  CONVERTED:    'bg-green-500/20 text-green-400',
  UNSUBSCRIBED: 'bg-red-500/20 text-red-400',
};

function parseCSV(text: string): any[] {
  const lines  = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const obj: any = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    return obj;
  }).filter(r => r.firstname || r.first_name || r.name || r.phone || r.email);
}

export default function ProspectsPage() {
  const [prospects, setProspects]   = useState<Prospect[]>([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState<string[]>([]);
  const [filter, setFilter]         = useState('ALL');
  const [message, setMessage]       = useState('');
  const [channel, setChannel]       = useState('SMS');
  const [generating, setGenerating] = useState(false);
  const [blasting, setBlasting]     = useState(false);
  const [goal, setGoal]             = useState('');
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [showManual, setShowManual] = useState(false);
  const [manual, setManual]         = useState({ firstName: '', lastName: '', phone: '', email: '' });
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchProspects = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter !== 'ALL' ? `?status=${filter}` : '';
      const data   = await apiFetch(`/v1/prospects${params}`);
      setProspects(data.prospects || []);
      setTotal(data.total || 0);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchProspects(); }, [fetchProspects]);

  const handleCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text     = await file.text();
    const parsed   = parseCSV(text);
    if (parsed.length === 0) { setError('No valid rows found in CSV'); return; }
    setError(''); setSuccess('');
    try {
      const data = await apiFetch('/v1/prospects/upload', { method: 'POST', body: JSON.stringify({ prospects: parsed }) });
      setSuccess(`${data.count} prospects uploaded successfully`);
      fetchProspects();
    } catch (e: any) { setError(e.message); }
    e.target.value = '';
  };

  const handleManualAdd = async () => {
    if (!manual.firstName) { setError('First name is required'); return; }
    if (!manual.phone && !manual.email) { setError('Phone or email is required'); return; }
    try {
      await apiFetch('/v1/prospects/upload', { method: 'POST', body: JSON.stringify({ prospects: [manual] }) });
      setSuccess('Prospect added');
      setManual({ firstName: '', lastName: '', phone: '', email: '' });
      setShowManual(false);
      fetchProspects();
    } catch (e: any) { setError(e.message); }
  };

  const generateMessage = async () => {
    if (!goal) { setError('Enter a goal first'); return; }
    setGenerating(true); setError('');
    try {
      const data = await apiFetch('/v1/prospects/generate-message', {
        method: 'POST',
        body:   JSON.stringify({ goal, channel, businessType: 'general' }),
      });
      setMessage(data.message);
    } catch (e: any) { setError(e.message); }
    finally { setGenerating(false); }
  };

  const blast = async () => {
    if (!message) { setError('Write or generate a message first'); return; }
    const pending = prospects.filter(p => p.status === 'PENDING');
    if (pending.length === 0) { setError('No pending prospects to blast'); return; }
    if (!confirm(`Send to ${selected.length > 0 ? selected.length : pending.length} prospects via ${channel}?`)) return;
    setBlasting(true); setError(''); setSuccess('');
    try {
      const data = await apiFetch('/v1/prospects/blast', {
        method: 'POST',
        body:   JSON.stringify({ message, channel, prospectIds: selected.length > 0 ? selected : undefined }),
      });
      setSuccess(`Sent: ${data.sent} | Failed: ${data.failed}`);
      setSelected([]);
      fetchProspects();
    } catch (e: any) { setError(e.message); }
    finally { setBlasting(false); }
  };

  const convertToLead = async (id: string) => {
    try {
      await apiFetch(`/v1/prospects/${id}/convert`, { method: 'POST' });
      setSuccess('Prospect converted to lead');
      fetchProspects();
    } catch (e: any) { setError(e.message); }
  };

  const deleteSelected = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Delete ${selected.length} prospects?`)) return;
    try {
      await apiFetch('/v1/prospects', { method: 'DELETE', body: JSON.stringify({ ids: selected }) });
      setSelected([]);
      fetchProspects();
    } catch (e: any) { setError(e.message); }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => {
    setSelected(prev => prev.length === prospects.length ? [] : prospects.map(p => p.id));
  };

  const pending   = prospects.filter(p => p.status === 'PENDING').length;
  const sent      = prospects.filter(p => p.status === 'SENT').length;
  const converted = prospects.filter(p => p.status === 'CONVERTED').length;
  const filtered  = filter === 'ALL' ? prospects : prospects.filter(p => p.status === filter);

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Prospecting Engine</h1>
          <p className="text-gray-500 mt-1">Upload contacts, blast messages, convert replies to leads</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowManual(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dark-100 text-gray-400 text-sm font-medium hover:text-white transition-colors">
            <Plus size={16} /> Add contact
          </button>
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors">
            <Upload size={16} /> Upload CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSV} />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total prospects', value: total,     color: 'text-brand-400', bg: 'bg-brand-500/20', icon: Users       },
          { label: 'Pending',         value: pending,   color: 'text-gray-400',  bg: 'bg-gray-500/20',  icon: Users       },
          { label: 'Sent',            value: sent,      color: 'text-blue-400',  bg: 'bg-blue-500/20',  icon: Send        },
          { label: 'Converted',       value: converted, color: 'text-green-400', bg: 'bg-green-500/20', icon: CheckCircle },
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2">
          <div className="bg-dark-300 border border-dark-100 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4">Blast message</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Campaign goal</label>
                <input className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500"
                  value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g. Promote March car sale, Get gym signups" />
              </div>
              <div className="flex gap-2">
                {['SMS', 'EMAIL'].map(ch => (
                  <button key={ch} onClick={() => setChannel(ch)}
                    className={['flex-1 py-2 rounded-lg border text-sm font-semibold transition-all',
                      channel === ch ? 'bg-brand-500/20 border-brand-500/50 text-brand-400' : 'border-dark-100 text-gray-400 hover:border-gray-600'].join(' ')}>
                    {ch}
                  </button>
                ))}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-400">Message</label>
                  <button onClick={generateMessage} disabled={generating || !goal}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent-500/10 border border-accent-500/30 text-accent-400 text-xs font-semibold hover:bg-accent-500/20 disabled:opacity-40">
                    <Zap size={12} />{generating ? 'Generating...' : 'AI Generate'}
                  </button>
                </div>
                <textarea className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 resize-none h-28"
                  value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Write your message or click AI Generate. Use [First Name] for personalisation." />
                {channel === 'SMS' && (
                  <p className={['text-xs mt-1', message.length > 160 ? 'text-red-400' : 'text-gray-500'].join(' ')}>
                    {message.length}/160 characters
                  </p>
                )}
              </div>
              {error   && <p className="text-red-400 text-sm">{error}</p>}
              {success && <p className="text-green-400 text-sm">{success}</p>}
              <button onClick={blast} disabled={blasting || !message || pending === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 disabled:opacity-40 transition-colors">
                <Send size={15} />
                {blasting ? 'Sending...' : `Blast to ${selected.length > 0 ? selected.length + ' selected' : pending + ' pending'} prospects`}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-dark-300 border border-dark-100 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-3">CSV format</h3>
          <p className="text-xs text-gray-400 mb-3">Your CSV should have these columns:</p>
          <div className="bg-dark-200 rounded-lg p-3 font-mono text-xs text-green-400 mb-3">
            firstName,lastName,phone,email<br/>
            John,Doe,+27821234567,john@email.com<br/>
            Jane,Smith,+27831234567,
          </div>
          <p className="text-xs text-gray-500 mb-4">Phone numbers must include country code e.g. +27 for SA</p>
          <button onClick={() => {
            const csv = 'firstName,lastName,phone,email\nJohn,Doe,+27821234567,john@example.com\nJane,Smith,+27831234567,';
            const blob = new Blob([csv], { type: 'text/csv' });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href = url; a.download = 'prospects_template.csv'; a.click();
          }} className="w-full px-3 py-2 rounded-lg border border-dark-100 text-gray-400 text-xs font-medium hover:text-white transition-colors">
            Download template
          </button>
        </div>
      </div>

      <div className="bg-dark-300 border border-dark-100 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-dark-100">
          <div className="flex gap-2">
            {['ALL', 'PENDING', 'SENT', 'REPLIED', 'CONVERTED'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={['px-3 py-1 rounded-lg text-xs font-semibold transition-all',
                  filter === f ? 'bg-brand-500 text-white' : 'bg-dark-200 border border-dark-100 text-gray-400 hover:text-white'].join(' ')}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {selected.length > 0 && (
              <button onClick={deleteSelected} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30">
                <Trash2 size={13} /> Delete ({selected.length})
              </button>
            )}
            <button onClick={fetchProspects} className="p-1.5 rounded-lg border border-dark-100 text-gray-400 hover:text-white transition-colors">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-500">Loading prospects...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Users size={32} className="mb-3 opacity-30" />
            <p className="font-medium">No prospects yet</p>
            <p className="text-sm mt-1">Upload a CSV or add contacts manually to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-100">
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" checked={selected.length === prospects.length && prospects.length > 0}
                      onChange={selectAll} className="rounded" />
                  </th>
                  {['Name', 'Phone', 'Email', 'Status', 'Sent at', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-dark-200 transition-colors group">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} className="rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{p.firstName} {p.lastName || ''}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{p.phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{p.email || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={['px-2 py-0.5 rounded-full text-xs font-semibold', STATUS_STYLES[p.status] || 'bg-gray-500/20 text-gray-400'].join(' ')}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {p.sentAt ? new Date(p.sentAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {p.status !== 'CONVERTED' && (
                        <button onClick={() => convertToLead(p.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs font-semibold hover:bg-green-500/30 opacity-0 group-hover:opacity-100 transition-all">
                          <UserPlus size={12} /> Convert
                        </button>
                      )}
                      {p.status === 'CONVERTED' && (
                        <span className="flex items-center gap-1 text-xs text-green-400">
                          <CheckCircle size={12} /> Lead
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-3 border-t border-dark-100 text-xs text-gray-500">
          {filtered.length} of {total} prospects
        </div>
      </div>

      {showManual && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:50,padding:'1rem' }}>
          <div className="bg-dark-300 border border-dark-100 rounded-xl w-full max-w-md p-6">
            <h2 className="font-bold text-lg text-white mb-5">Add contact manually</h2>
            <div className="space-y-3">
              {[['First name *', 'firstName', 'text'], ['Last name', 'lastName', 'text'], ['Phone (+27...)', 'phone', 'tel'], ['Email', 'email', 'email']].map(([label, field, type]) => (
                <div key={field}>
                  <label className="text-xs font-medium text-gray-400 mb-1 block">{label}</label>
                  <input type={type} className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500"
                    value={(manual as any)[field]} onChange={e => setManual(m => ({ ...m, [field]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowManual(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-dark-100 text-gray-400 text-sm font-medium hover:bg-dark-200">Cancel</button>
              <button onClick={handleManualAdd} className="flex-1 px-4 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600">Add prospect</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
