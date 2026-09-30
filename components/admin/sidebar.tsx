'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Briefcase, Users, UserCheck, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client'; // İstemci tarafı Supabase istemciniz

const navItems = [
  {
    title: 'Kontrol Paneli',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: 'İşler & Projeler',
    href: '/admin/jobs',
    icon: Briefcase,
  },
  {
    title: 'Müşteriler',
    href: '/admin/customers',
    icon: UserCheck,
  },
  {
    title: 'Kullanıcılar',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Ayarlar',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="w-64 border-r border-slate-200 bg-white min-h-screen flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Brand / Logo */}
        <div className="px-3 py-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Yönetim Paneli</h2>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <Icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}