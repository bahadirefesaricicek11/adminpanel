'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Sidebar } from './sidebar';
import { AdminHeader } from './header';
import { useSessionTimeout, SessionWarning } from '@/lib/hooks/useSessionTimeout';
import { can, getCurrentAdminProfile, AdminRole } from '@/lib/auth/permissions';

export function AdminProtection({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [authorized, setAuthorized] = useState(true);
  const pathname = usePathname();
  const supabase = createClient();
  const { extendSession } = useSessionTimeout();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/admin/login';
      } else {
        const profile = await getCurrentAdminProfile();
        const role = profile?.role as AdminRole | undefined;
        const requiredPermission = pathname.includes('/users') || pathname.includes('/roles')
          ? 'manage_users'
          : pathname.includes('/content') || pathname.includes('/versions')
            ? 'edit_content'
            : 'view_content';

        if (!can(role, requiredPermission)) {
          setAuthorized(false);
          setLoading(false);
          setAuthenticated(true);
          return;
        }

        setAuthenticated(true);
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, isLoginPage, supabase]);

  // Login page - no sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading || !authenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium">Oturum doğrulanıyor...</div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-lg border border-amber-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Erişim Yetkiniz Yok</h1>
          <p className="mt-2 text-sm text-slate-600">Bu sayfayı görüntülemek için hesabınızın yetkisi yeterli değil.</p>
        </div>
      </div>
    );
  }

  // Admin pages - with sidebar and session monitoring
  return (
    <>
      <SessionWarning />
      <div className="flex h-screen bg-[#f4f8fc]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="admin-surface flex-1 overflow-auto p-5 md:p-8">{children}</main>
        </div>
      </div>
    </>
  );
}