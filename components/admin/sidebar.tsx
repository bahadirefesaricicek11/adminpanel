'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Users, Briefcase, Settings } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', icon: BarChart3, label: 'Dashboard', exact: true },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">PaintCo Admin</h1>
        <p className="text-sm text-slate-400">Management Panel</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive =
            item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-700">
        <Link
          href="/auth/login"
          className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white transition-colors"
        >
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
