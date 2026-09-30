'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function AdminProtection({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  // Login sayfasındaysak korumayı ve yönlendirmeyi tamamen devre dışı bırak
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
        setAuthenticated(true);
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && !isLoginPage) {
        window.location.href = '/admin/login';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading || !authenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100">
        <div className="text-slate-500 font-medium">Oturum doğrulanıyor...</div>
      </div>
    );
  }

  return <>{children}</>;
}