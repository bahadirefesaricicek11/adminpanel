'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // Show warning 5 minutes before logout

export function useSessionTimeout() {
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(0);
  const supabase = createClient();

  const resetTimer = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);

    lastActivityRef.current = Date.now();

    // Show warning 5 minutes before logout
    warningTimeoutRef.current = setTimeout(() => {
      const warning = document.getElementById('session-warning');
      if (warning) {
        warning.style.display = 'block';
      }
    }, INACTIVITY_TIMEOUT - WARNING_TIME);

    // Auto logout after inactivity
    timeoutRef.current = setTimeout(async () => {
      try {
        // Log the session end
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase
            .from('session_logs')
            .update({
              logout_timestamp: new Date().toISOString(),
              status: 'expired',
              session_duration_seconds: Math.floor(
                (Date.now() - lastActivityRef.current) / 1000
              ),
            })
            .eq('user_id', session.user.id)
            .is('logout_timestamp', null);
        }

        // Sign out
        await supabase.auth.signOut();

        // Redirect after timeout
        router.push('/admin/login');
      } catch (error) {
        console.error('Session timeout error:', error);
        router.push('/admin/login');
      }
    }, INACTIVITY_TIMEOUT);
  }, [router, supabase]);

  const extendSession = useCallback(() => {
    resetTimer();
    const warning = document.getElementById('session-warning');
    if (warning) {
      warning.style.display = 'none';
    }
  }, [resetTimer]);

  useEffect(() => {
    if (pathname === '/admin/login') return;

    // Initialize activity timestamp
    lastActivityRef.current = Date.now();
    
    // Initialize timer on mount
    resetTimer();

    // Attach activity listeners
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetTimer();
      const warning = document.getElementById('session-warning');
      if (warning && warning.style.display !== 'none') {
        warning.style.display = 'none';
      }
    };

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Listen for extend-session custom event
    const handleExtend = () => {
      extendSession();
    };
    window.addEventListener('extend-session', handleExtend);

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
      window.removeEventListener('extend-session', handleExtend);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, [pathname, resetTimer, extendSession]);

  return { extendSession };
}

// Session Warning Component (simple display component)
export function SessionWarning() {
  const handleExtend = () => {
    const event = new CustomEvent('extend-session');
    window.dispatchEvent(event);
  };

  return (
    <div
      id="session-warning"
      style={{ display: 'none' }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
    >
      <div className="bg-white rounded-lg p-6 max-w-sm shadow-lg border-l-4 border-yellow-500">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Oturum Süresi Dolmak Üzere</h2>
        <p className="text-slate-600 mb-4">
          Güvenlik nedeniyle, 5 dakika içinde oturumunuz kapatılacaktır. Devam etmek için aşağıdaki düğmeyi tıklayın.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleExtend}
            className="flex-1 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 font-medium"
          >
            Oturuma Devam Et
          </button>
          <a
            href="/admin/login"
            className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded hover:bg-slate-300 font-medium text-center"
          >
            Çıkış Yap
          </a>
        </div>
      </div>
    </div>
  );
}

