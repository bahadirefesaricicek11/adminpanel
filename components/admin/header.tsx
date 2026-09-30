'use client';

import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function AdminHeader() {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <Input
              type="search"
              placeholder="Ara..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-slate-600 hover:text-slate-900" title="Bildirimler">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              Y
            </div>
            <span className="text-sm">Yönetici</span>
          </button>
        </div>
      </div>
    </header>
  );
}