'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, User, Building2, Phone, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    businessName: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!form.firstName || !form.email || !form.password || !form.businessName) {
      setError('Please fill in all required fields');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:4000/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
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

  const BENEFITS = [
    'Free 14-day trial — no credit card needed',
    'AI replies to leads in seconds 24/7',
    'Setup in under 10 minutes',
  ];

  return (
    <div className="min-h-screen bg-dark-400 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        <div className="hidden lg:block">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-white text-2xl">Voxelix</span>
            <span className="text-accent-500 font-bold text-2xl">Hub</span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Never lose a lead again
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            AI-powered lead capture and follow-up for South African car dealerships.
          </p>
          <div className="space-y-4">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-brand-400 shrink-0" />
                <p className="text-gray-300">{b}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 p-5 rounded-xl bg-dark-300 border border-dark-100">
            <p className="text-gray-300 text-sm italic mb-3">
              "VoxelixHub helped us respond to leads 10x faster. We booked 8 extra test drives in the first week alone."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">TN</div>
              <div>
                <p className="text-white text-sm font-semibold">Thabo Nkosi</p>
                <p className="text-gray-500 text-xs">Sales Manager, AutoPlex Johannesburg</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <span className="font-bold text-white text-2xl">Voxelix</span>
              <span className="text-accent-500 font-bold text-2xl">Hub</span>
            </div>
          </div>

          <div className="bg-dark-300 border border-dark-100 rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
            <p className="text-gray-500 text-sm mb-6">Start your free 14-day trial today</p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-1.5 block">First Name *</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      placeholder="Bonface"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-1.5 block">Last Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      placeholder="Harry"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-400 mb-1.5 block">Business Name *</label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    placeholder="Cape Town Auto"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-400 mb-1.5 block">Email Address *</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@business.co.za"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-400 mb-1.5 block">Phone Number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+27821234567"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-400 mb-1.5 block">Password *</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min 8 characters"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-dark-100 bg-dark-200 text-white text-sm outline-none focus:border-brand-500 transition-colors"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Free Account'
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
