'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { BarChart3, Users, Briefcase, Settings, LogOut } from 'lucide-react';
import { clearAuthToken } from '@/lib/auth';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAuthToken();
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin', icon: BarChart3, label: 'Kontrol Paneli', exact: true },
    { href: '/admin/users', icon: Users, label: 'Kullanıcılar' },
    { href: '/admin/jobs', icon: Briefcase, label: 'İşler' },
    { href: '/admin/settings', icon: Settings, label: 'Ayarlar' },
  ];

  return (
    <aside className="w-64 border-r border-slate-200/80 bg-white min-h-screen p-6 flex flex-col justify-between">
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">PaintCo Admin</h1>
          <p className="text-sm text-slate-500">Yönetim Paneli</p>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive =
              item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-slate-200/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors rounded-lg"
        >
          <LogOut size={18} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}