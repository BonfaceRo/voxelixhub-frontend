'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, Package, DollarSign, Tag, Search } from 'lucide-react';
import { getToken } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: 'bg-green-500/20 text-green-400',
  SOLD:      'bg-red-500/20 text-red-400',
  RESERVED:  'bg-amber-500/20 text-amber-400',
};

function AddItemModal({ onClose, onAdd }: { onClose: () => void; onAdd: (item: any) => void }) {
  const [form, setForm] = useState({
    name: '', description: '', price: '',
    category: '', condition: 'NEW', status: 'AVAILABLE', quantity: '1',
  });
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!form.name) return;
    setLoading(true);
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
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-300 border border-dark-100 rounded-xl w-full max-w-lg p-6">
        <h2 className="font-bold text-lg text-white mb-6">Add Stock Item</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400 mb-1.5 block">Item Name *</label>
            <input
              className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Toyota Hilux 2023 Double Cab"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400 mb-1.5 block">Description</label>
            <textarea
              className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 resize-none h-20"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. White, 45,000km, finance available"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">Price (R)</label>
              <input
                type="number"
                className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="620000"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">Category</label>
              <input
                className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. SUV, Sedan, Bakkie"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">Condition</label>
              <select
                className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none"
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
              >
                <option value="NEW">New</option>
                <option value="USED">Used</option>
                <option value="DEMO">Demo</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">Status</label>
              <select
                className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="SOLD">Sold</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">Quantity</label>
              <input
                type="number"
                className="w-full px-3 py-2.5 rounded-lg border border-dark-100 bg-dark-200 text-white text-sm outline-none"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                min="1"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-dark-100 text-gray-400 text-sm font-medium hover:bg-dark-200 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={loading || !form.name}
            className="flex-1 px-4 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors disabled:opacity-40"
          >
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StockPage() {
  const [stock, setStock]       = useState<StockItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('ALL');

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const res = await fetch(`${API_URL}/v1/stock`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setStock(data.stock || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsSold = async (id: string) => {
    try {
      await fetch(`${API_URL}/v1/stock/${id}/sold`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      setStock(prev => prev.map(s => s.id === id ? { ...s, status: 'SOLD' } : s));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await fetch(`${API_URL}/v1/stock/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      setStock(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = stock.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || s.status === filter;
    return matchSearch && matchFilter;
  });

  const available = stock.filter(s => s.status === 'AVAILABLE').length;
  const sold      = stock.filter(s => s.status === 'SOLD').length;
  const reserved  = stock.filter(s => s.status === 'RESERVED').length;

  const formatPrice = (price: number) => {
    return 'R' + price.toLocaleString('en-ZA');
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Stock & Inventory</h1>
          <p className="text-gray-500 mt-1">
            Manage your stock — AI uses this to answer customer questions
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Items',  value: stock.length,  icon: Package,      color: 'text-brand-400',  bg: 'bg-brand-500/20'  },
          { label: 'Available',    value: available,     icon: CheckCircle,  color: 'text-green-400',  bg: 'bg-green-500/20'  },
          { label: 'Reserved',     value: reserved,      icon: Tag,          color: 'text-amber-400',  bg: 'bg-amber-500/20'  },
          { label: 'Sold',         value: sold,          icon: DollarSign,   color: 'text-red-400',    bg: 'bg-red-500/20'    },
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

      <div className="flex gap-3 mb-4">
        <div className="flex items-center gap-2 bg-dark-300 border border-dark-100 rounded-lg px-3 py-2 flex-1 max-w-sm">
          <Search size={15} className="text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stock..."
            className="bg-transparent text-sm text-white placeholder:text-gray-500 outline-none flex-1"
          />
        </div>
        <div className="flex items-center gap-1 bg-dark-300 border border-dark-100 rounded-lg p-1">
          {['ALL', 'AVAILABLE', 'RESERVED', 'SOLD'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={[
                'px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize',
                filter === f ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'
              ].join(' ')}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-dark-300 border border-dark-100 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <Package size={32} className="mb-3 text-brand-500/30" />
            <p className="font-semibold">No stock items yet</p>
            <p className="text-sm mt-1">Add your first item so AI can answer customer questions</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-semibold"
            >
              Add First Item
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-100">
                  {['Item', 'Category', 'Condition', 'Price', 'Quantity', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-dark-200 transition-colors group">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-white">{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{item.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-sm">{item.category || '—'}</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-dark-200 text-gray-400">
                        {item.condition}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white font-semibold">
                      {item.price ? formatPrice(item.price) : '—'}
                    </td>
                    <td className="px-4 py-4 text-gray-400">{item.quantity}</td>
                    <td className="px-4 py-4">
                      <span className={['px-2 py-0.5 rounded-full text-xs font-semibold', STATUS_STYLES[item.status] || ''].join(' ')}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.status === 'AVAILABLE' && (
                          <button
                            onClick={() => markAsSold(item.id)}
                            className="px-2 py-1 rounded-md text-xs font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            Mark Sold
                          </button>
                        )}
                        <button
                          onClick={() => deleteItem(item.id)}
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
        )}
        <div className="px-4 py-3 border-t border-dark-100 text-xs text-gray-500 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          AI is using your available stock to answer customer questions automatically
        </div>
      </div>

      {showModal && (
        <AddItemModal
          onClose={() => setShowModal(false)}
          onAdd={(item) => setStock(prev => [item, ...prev])}
        />
      )}
    </div>
  );
}
