'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function AdminTools() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [query, setQuery] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const loadUnread = async () => {
      const { count } = await supabase
        .from('admin_notifications')
        .select('*', { count: 'exact', head: true })
        .is('read_at', null);
      setUnreadCount(count ?? 0);
    };
    loadUnread();
  }, [supabase]);

  return (
    <div className="flex items-center gap-2">
      <form action="/admin/dashboard/search" className="hidden items-center rounded-xl border border-[#12242a]/10 bg-white md:flex">
        <Search size={16} className="ml-3 text-[#12242a]/35" />
        <input
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="İçerikte ara..."
          className="w-44 bg-transparent px-2 py-2 text-sm outline-none"
        />
      </form>
      <Link href="/admin/dashboard/notifications" aria-label="Bildirimler" className="relative rounded-xl p-2 text-[#12242a]/60 hover:bg-[#12242a]/5">
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Link>
    </div>
  );
}
