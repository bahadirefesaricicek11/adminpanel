'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function AdminProtection({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // 1. İlk oturum kontrolü
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

    // 2. Çıkış yapıldığında (signOut) anında tespiti ve yönlendirmeyi sağlayan dinleyici
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        window.location.href = '/admin/login';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading || !authenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100">
        <div className="text-slate-500 font-medium">Yükleniyor...</div>
      </div>
    );
  }

  return <>{children}</>;
}