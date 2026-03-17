'use client';

import { useState } from 'react';
import {
  Search, Plus, Phone, MessageSquare,
  Mail, Edit2, Trash2, Filter,
  ChevronDown, Users
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  score: number;
  notes: string;
  createdAt: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_LEADS: Lead[] = [
  { id: '1', firstName: 'Thabo',   lastName: 'Nkosi',    email: 'thabo@gmail.com',   phone: '+27821234567', source: 'WHATSAPP', status: 'HOT',       score: 92, notes: 'Interested in BMW X5',      createdAt: '2026-03-15' },
  { id: '2', firstName: 'Priya',   lastName: 'Pillay',   email: 'priya@gmail.com',   phone: '+27831234567', source: 'WEBSITE',  status: 'WARM',      score: 71, notes: 'Looking at Toyota Hilux',   createdAt: '2026-03-14' },
  { id: '3', firstName: 'James',   lastName: 'van Wyk',  email: 'james@gmail.com',   phone: '+27841234567', source: 'FACEBOOK', status: 'NEW',       score: 45, notes: 'Enquired about VW Polo',    createdAt: '2026-03-16' },
  { id: '4', firstName: 'Nomsa',   lastName: 'Dlamini',  email: 'nomsa@gmail.com',   phone: '+27851234567', source: 'WEBSITE',  status: 'WARM',      score: 65, notes: 'Test drive Honda CRV',      createdAt: '2026-03-13' },
  { id: '5', firstName: 'Ruan',    lastName: 'Botha',    email: 'ruan@gmail.com',    phone: '+27861234567', source: 'INSTAGRAM',status: 'NEW',       score: 30, notes: 'Asked about Ford Ranger',   createdAt: '2026-03-16' },
  { id: '6', firstName: 'Zanele',  lastName: 'Mokoena',  email: 'zanele@gmail.com',  phone: '+27871234567', source: 'WHATSAPP', status: 'CONVERTED', score: 100,notes: 'Bought Toyota Fortuner',   createdAt: '2026-03-10' },
  { id: '7', firstName: 'Pieter',  lastName: 'du Plessis',email:'pieter@gmail.com',  phone: '+27881234567', source: 'WEBSITE',  status: 'HOT',       score: 88, notes: 'Finance pre-approved',      createdAt: '2026-03-15' },
  { id: '8', firstName: 'Ayanda',  lastName: 'Zulu',     email: 'ayanda@gmail.com',  phone: '+27891234567', source: 'FACEBOOK', status: 'LOST',      score: 10, notes: 'Budget too low',            createdAt: '2026-03-08' },
];

// ── Status Config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  NEW:       { label: 'New',         class: 'bg-brand-500/20 text-brand-400' },
  CONTACTED: { label: 'Contacted',   class: 'bg-gray-500/20 text-gray-400' },
  WARM:      { label: 'Warm',        class: 'bg-amber-500/20 text-amber-400' },
  HOT:       { label: 'Hot 🔥',      class: 'bg-red-500/20 text-red-400' },
  CONVERTED: { label: 'Converted ✓', class: 'bg-green-500/20 text-green-400' },
  LOST:      { label: 'Lost',        class: 'bg-gray-500/20 text-gray-500' },
};

const SOURCE_CONFIG: Record<string, { label: string; class: string }> = {
  WEBSITE:   { label: 'Website',   class: 'bg-purple-500/20 text-purple-400' },
  WHATSAPP:  { label: 'WhatsApp',  class: 'bg-green-500/20 text-green-400' },
  FACEBOOK:  { label: 'Facebook',  class: 'bg-blue-500/20 text-blue-400' },
  INSTAGRAM: { label: 'Instagram', class: 'bg-pink-500/20 text-pink-400' },
  MANUAL:    { label: 'Manual',    class: 'bg-gray-500/20 text-gray-400' },
};

// ── Score Bar ─────────────────────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-red-500' :
    score >= 60 ? 'bg-amber-500' :
    score >= 40 ? 'bg-brand-500' :
    'bg-gray-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-dark-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-white w-6 text-right">{score}</span>
    </div>
  );
}

// ── Add Lead Modal ────────────────────────────────────────────────────────────
function AddLeadModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (lead: Partial<Lead>) => void;
}) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    source: 'WEBSITE',
    status: 'NEW',
    notes: '',
  });

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-300 border border-dark-100 rounded-xl w-full max-w-md p-6">
        <h2 className="font-bold text-lg text-white mb-6">Add New Lead</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">
                First Name *
              </label>
              <input
                className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="Thabo"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">
                Last Name
              </label>
              <input
                className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Nkosi"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400 mb-1.5 block">
              Phone
            </label>
            <input
              className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+27821234567"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400 mb-1.5 block">
              Email
            </label>
            <input
              className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="thabo@gmail.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">
                Source
              </label>
              <select
                className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              >
                {['WEBSITE', 'WHATSAPP', 'FACEBOOK', 'INSTAGRAM', 'MANUAL'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">
                Status
              </label>
              <select
                className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {['NEW', 'CONTACTED', 'WARM', 'HOT'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400 mb-1.5 block">
              Notes
            </label>
            <textarea
              className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors resize-none h-20"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Interested in..."
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
            className="flex-1 px-4 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors"
          >
            Add Lead
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Leads Page ────────────────────────────────────────────────────────────────
export default function LeadsPage() {
  const [leads, setLeads]           = useState<Lead[]>(MOCK_LEADS);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('all');
  const [showModal, setShowModal]   = useState(false);

  // Filter leads
  const filtered = leads.filter((l) => {
    const matchSearch =
      !search ||
      `${l.firstName} ${l.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search);
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAdd = (data: Partial<Lead>) => {
    const newLead: Lead = {
      id:        Date.now().toString(),
      firstName: data.firstName || '',
      lastName:  data.lastName  || '',
      email:     data.email     || '',
      phone:     data.phone     || '',
      source:    data.source    || 'MANUAL',
      status:    data.status    || 'NEW',
      score:     30,
      notes:     data.notes     || '',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleDelete = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads & CRM</h1>
          <p className="text-gray-500 mt-1">
            {leads.length} total leads ·{' '}
            {leads.filter((l) => l.status === 'HOT').length} hot prospects
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors"
        >
          <Plus size={16} />
          Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="flex items-center gap-2 bg-dark-300 border border-dark-100 rounded-lg px-3 py-2 flex-1 max-w-sm">
          <Search size={15} className="text-gray-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="bg-transparent text-sm text-white placeholder:text-gray-500 outline-none flex-1"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 bg-dark-300 border border-dark-100 rounded-lg p-1">
          {['all', 'NEW', 'WARM', 'HOT', 'CONVERTED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${
                statusFilter === s
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-300 border border-dark-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-100">
                {['Lead', 'Contact', 'Source', 'Status', 'Score', 'Notes', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-dark-200 transition-colors group"
                >
                  {/* Lead name */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {lead.firstName[0]}{lead.lastName?.[0] || ''}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {lead.firstName} {lead.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{lead.createdAt}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-4">
                    <p className="text-gray-300 text-xs">{lead.phone}</p>
                    <p className="text-gray-500 text-xs">{lead.email}</p>
                  </td>

                  {/* Source */}
                  <td className="px-4 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${SOURCE_CONFIG[lead.source]?.class || ''}`}>
                      {SOURCE_CONFIG[lead.source]?.label || lead.source}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_CONFIG[lead.status]?.class || ''}`}>
                      {STATUS_CONFIG[lead.status]?.label || lead.status}
                    </span>
                  </td>

                  {/* Score */}
                  <td className="px-4 py-4 w-32">
                    <ScoreBar score={lead.score} />
                  </td>

                  {/* Notes */}
                  <td className="px-4 py-4 max-w-[200px]">
                    <p className="text-xs text-gray-400 truncate">{lead.notes}</p>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1.5 rounded-md hover:bg-green-500/20 hover:text-green-400 text-gray-500 transition-colors"
                        title="Call"
                      >
                        <Phone size={14} />
                      </button>
                      <button
                        className="p-1.5 rounded-md hover:bg-blue-500/20 hover:text-blue-400 text-gray-500 transition-colors"
                        title="Email"
                      >
                        <Mail size={14} />
                      </button>
                      <button
                        className="p-1.5 rounded-md hover:bg-brand-500/20 hover:text-brand-400 text-gray-500 transition-colors"
                        title="Message"
                      >
                        <MessageSquare size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="p-1.5 rounded-md hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-colors"
                        title="Delete"
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

        {/* Footer */}
        <div className="px-4 py-3 border-t border-dark-100 text-xs text-gray-500">
          Showing {filtered.length} of {leads.length} leads
        </div>
      </div>

      {/* Add Lead Modal */}
      {showModal && (
        <AddLeadModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
