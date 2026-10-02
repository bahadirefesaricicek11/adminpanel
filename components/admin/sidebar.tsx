'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useCallback } from 'react';
import { LayoutDashboard, FileText, Users, Settings, LogOut, Activity, ShieldCheck, History, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const NAV_ITEMS = [
  { title: 'Kontrol Paneli', href: '/admin/dashboard', icon: LayoutDashboard, exact: true },
  { title: 'Website İçeriği', href: '/admin/dashboard/content', icon: FileText },
  { title: 'Kullanıcılar', href: '/admin/dashboard/users', icon: Users },
  { title: 'Roller ve Yetkiler', href: '/admin/dashboard/roles', icon: ShieldCheck },
  { title: 'Faaliyet Günlükleri', href: '/admin/dashboard/activity-logs', icon: Activity },
  { title: 'Sürüm Geçmişi', href: '/admin/dashboard/versions', icon: History },
  { title: 'Analitik ve Raporlar', href: '/admin/dashboard/analytics', icon: BarChart3 },
  { title: 'Ayarlar', href: '/admin/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  }, []);

  const navItems = useMemo(
    () => NAV_ITEMS.map((item) => ({
      ...item,
      isActive: item.exact ? pathname === item.href : pathname.startsWith(item.href),
    })),
    [pathname]
  );

  return (
    <aside className="w-64 border-r border-slate-200 bg-white min-h-screen flex flex-col justify-between p-4">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Yönetim Paneli</h2>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200',
                  item.isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <Icon size={18} className={item.isActive ? 'text-blue-600' : 'text-slate-400'} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <LogOut size={18} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}