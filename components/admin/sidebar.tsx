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
    <aside className="flex min-h-screen w-64 shrink-0 flex-col justify-between border-r border-[#dce8f3] bg-white p-4 text-[#18324b]">
      <div className="space-y-8">
        <div className="border-b border-[#dce8f3] px-3 pb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2571c5]">PaintCo</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">Kontrol odası</h2>
          <p className="mt-1 text-xs text-[#18324b]/45">Duvar boyama merkezi</p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                  item.isActive
                    ? 'bg-[#e3f1ff] font-semibold text-[#1d65ad]'
                    : 'text-[#18324b]/60 hover:bg-[#f1f7fd] hover:text-[#18324b]'
                )}
              >
                <Icon size={18} className={item.isActive ? 'text-[#2571c5]' : 'text-[#18324b]/35'} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[#dce8f3] pt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#18324b]/55 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}