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
    <aside className="flex min-h-screen w-64 shrink-0 flex-col justify-between bg-[#12242a] p-4 text-white">
      <div className="space-y-8">
        <div className="border-b border-white/10 px-3 pb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d9ff4f]">PaintCo</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">Kontrol odası</h2>
          <p className="mt-1 text-xs text-white/40">Yönetim paneli</p>
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
                    ? 'bg-[#d9ff4f] font-semibold text-[#12242a]'
                    : 'text-white/55 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon size={18} className={item.isActive ? 'text-[#12242a]' : 'text-white/40'} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 pt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/55 transition-colors duration-200 hover:bg-[#e4554f]/15 hover:text-[#ff9d96]"
        >
          <LogOut size={18} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}