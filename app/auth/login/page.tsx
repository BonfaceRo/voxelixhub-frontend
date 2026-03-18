'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('tenant', JSON.stringify(data.tenant));
      router.push('/dashboard');
    } catch (err) {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#080810' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6929f5, #8b5cf6)' }}>
              <Zap size={20} className="text-white" />
            </div>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#f0f0f5' }}>
              Voxelix<span style={{ color: '#c9a84c' }}>Hub</span>
            </span>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#f0f0f5' }}>Welcome back</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to your account</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: '#0f0f1a', border: '1px solid #1e1e35' }}>
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none"
                  style={{ background: '#161625', border: '1px solid #1e1e35' }}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-white text-sm outline-none"
                  style={{ background: '#161625', border: '1px solid #1e1e35' }}
                />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6929f5, #8b5cf6)', boxShadow: '0 4px 16px rgba(105,41,245,0.35)' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Do not have an account?{' '}
              <Link href="/auth/register" className="font-semibold" style={{ color: '#a78bfa' }}>
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
