'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Package, DollarSign, Tag, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

interface StockItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  status: string;
  quantity: number;
  createdAt: string;
}

const STATUS_STYLES: Record<string, { label: string; class: string }> = {
  AVAILABLE: { label: 'Available', class: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  SOLD:      { label: 'Sold',      class: 'bg-red-500/10 text-red-400 border border-red-500/20' },
  RESERVED:  { label: 'Reserved',  class: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
};

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl"
    >
      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
        <CheckCircle size={12} className="text-white" />
      </div>
      <span className="text-sm font-medium text-white">{message}</span>
    </motion.div>
  );
}

function AddItemDrawer({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (item: any) => void;
}) {
  const [form, setForm] = useState({
    name: '', description: '', price: '',
    category: '', condition: 'NEW', status: 'AVAILABLE', quantity: '1',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const reset = () => {
    setForm({ name: '', description: '', price: '', category: '', condition: 'NEW', status: 'AVAILABLE', quantity: '1' });
    setError('');
  };

  const handleClose = () => { reset(); onClose(); };

  const handleAdd = async () => {
    if (!form.name.trim()) { setError('Item name is required'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/v1/stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        onAdd(data.item);
        reset();
        onClose();
      } else {
        setError(data.error || 'Failed to add item');
      }
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder:text-gray-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all";
  const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[420px] z-50 flex flex-col"
            style={{ background: '#111827', boxShadow: '-8px 0 40px rgba(0,0,0,0.5)' }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
              <div>
                <h2 className="text-base font-semibold text-white">Add Stock Item</h2>
                <p className="text-xs text-gray-500 mt-0.5">AI will use this to answer customer questions</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Basic Info</div>
                <div>
                  <label className={labelClass}>Item Name *</label>
                  <input
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Toyota Hilux 2023 Double Cab"
                  />
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    className={inputClass + ' resize-none h-20'}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="e.g. White, 45,000km, finance available"
                  />
                </div>
              </div>

              <div className="h-px bg-gray-800" />

              <div className="space-y-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pricing</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Price (R)</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="620000"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Category</label>
                    <input
                      className={inputClass}
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="e.g. SUV, Bakkie"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-800" />

              <div className="space-y-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Condition</label>
                    <select
                      className={inputClass}
                      value={form.condition}
                      onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    >
                      <option value="NEW">New</option>
                      <option value="USED">Used</option>
                      <option value="DEMO">Demo</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      className={inputClass}
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="RESERVED">Reserved</option>
                      <option value="SOLD">Sold</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Quantity</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      min="1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 border-t border-gray-800 flex items-center justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={loading || !form.name.trim()}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{ background: loading ? '#4c1d95' : 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
              >
                {loading ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function StockPage() {
  const [stock, setStock]         = useState<StockItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('ALL');
  const [toast, setToast]         = useState('');

  useEffect(() => { fetchStock(); }, []);

  const fetchStock = async () => {
    try {
      const res = await fetch(`${API_URL}/v1/stock`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setStock(data.stock || []);
    } catch {}
    finally { setLoading(false); }
  };

  const markAsSold = async (id: string) => {
    try {
      await fetch(`${API_URL}/v1/stock/${id}/sold`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      setStock(prev => prev.map(s => s.id === id ? { ...s, status: 'SOLD' } : s));
    } catch {}
  };

  const deleteItem = async (id: string) => {
    try {
      await fetch(`${API_URL}/v1/stock/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      setStock(prev => prev.filter(s => s.id !== id));
    } catch {}
  };

  const handleAdd = (item: StockItem) => {
    setStock(prev => [item, ...prev]);
    setToast('Item added successfully');
  };

  const filtered = stock.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || s.status === filter;
    return matchSearch && matchFilter;
  });

  const available = stock.filter(s => s.status === 'AVAILABLE').length;
  const sold      = stock.filter(s => s.status === 'SOLD').length;
  const reserved  = stock.filter(s => s.status === 'RESERVED').length;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Stock and Inventory</h1>
          <p className="text-gray-500 mt-1">AI uses your stock to answer customer questions accurately</p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 14px rgba(109,40,217,0.4)' }}
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Items', value: stock.length, icon: Package,     color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Available',   value: available,    icon: CheckCircle, color: 'text-emerald-400',bg: 'bg-emerald-500/10'},
          { label: 'Reserved',    value: reserved,     icon: Tag,         color: 'text-amber-400',  bg: 'bg-amber-500/10'  },
          { label: 'Sold',        value: sold,         icon: DollarSign,  color: 'text-red-400',    bg: 'bg-red-500/10'    },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-5 border border-gray-800" style={{ background: '#111827' }}>
            <div className={['w-9 h-9 rounded-xl flex items-center justify-center mb-3', s.bg, s.color].join(' ')}>
              <s.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1 max-w-sm border border-gray-800" style={{ background: '#111827' }}>
          <Search size={15} className="text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stock..."
            className="bg-transparent text-sm text-white placeholder:text-gray-500 outline-none flex-1"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg p-1 border border-gray-800" style={{ background: '#111827' }}>
          {['ALL', 'AVAILABLE', 'RESERVED', 'SOLD'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={[
                'px-3 py-1.5 rounded-md text-xs font-semibold transition-all',
                filter === f
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              ].join(' ')}
              style={filter === f ? { background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' } : {}}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-800 overflow-hidden" style={{ background: '#111827' }}>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <Package size={32} className="mb-3 opacity-30" />
            <p className="font-semibold text-gray-400">No stock items yet</p>
            <p className="text-sm mt-1">Add your first item so AI can answer customer questions</p>
            <button
              onClick={() => setDrawerOpen(true)}
              className="mt-4 px-4 py-2 rounded-lg text-white text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
            >
              Add First Item
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {['Item', 'Category', 'Condition', 'Price', 'Qty', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors group">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{item.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{item.category || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-700/50 text-gray-400">
                      {item.condition}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white font-semibold">
                    {item.price ? 'R' + Number(item.price).toLocaleString('en-ZA') : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{item.quantity}</td>
                  <td className="px-4 py-3">
                    <span className={['px-2.5 py-1 rounded-full text-xs font-semibold', STATUS_STYLES[item.status]?.class || ''].join(' ')}>
                      {STATUS_STYLES[item.status]?.label || item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.status === 'AVAILABLE' && (
                        <button
                          onClick={() => markAsSold(item.id)}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                        >
                          Mark Sold
                        </button>
                      )}
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-1.5 rounded-md hover:bg-red-500/10 hover:text-red-400 text-gray-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="px-4 py-3 border-t border-gray-800 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs text-gray-600">AI is reading your available stock to answer customer questions</span>
        </div>
      </div>

      <AddItemDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdd={handleAdd}
      />

      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast('')} />}
      </AnimatePresence>
    </div>
  );
}
