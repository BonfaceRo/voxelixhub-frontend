'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Mail,
  BarChart3,
  Star,
  Bot,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    group: 'Main',
    items: [
      { href: '/dashboard',          icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/dashboard/leads',    icon: Users,           label: 'Leads & CRM' },
      { href: '/dashboard/inbox',    icon: MessageSquare,   label: 'AI Inbox' },
    ],
  },
  {
    group: 'Marketing',
    items: [
      { href: '/dashboard/campaigns', icon: Mail,     label: 'Campaigns' },
      { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    ],
  },
  {
    group: 'Growth',
    items: [
      { href: '/dashboard/reviews',   icon: Star, label: 'Reviews' },
      { href: '/dashboard/ai-agents', icon: Bot,  label: 'AI Agents' },
    ],
  },
  {
    group: 'System',
    items: [
      { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col border-r border-dark-100 bg-dark-300 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-dark-100">
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <span className="font-bold text-white text-lg">Voxelix</span>
          <span className="text-accent-500 font-bold text-lg">Hub</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {NAV_ITEMS.map((group) => (
          <div key={group.group} className="mb-6">
            <p className="px-3 mb-2 text-xs font-semibold text-dark-100 uppercase tracking-wider"
               style={{ color: '#8b8fd8' }}>
              {group.group}
            </p>
            {group.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-all ${
                    isActive
                      ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                      : 'text-gray-400 hover:bg-dark-200 hover:text-white'
                  }`}
                >
                  <item.icon size={18} className="shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-dark-100 p-3">
        <Link
          href="/auth/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
