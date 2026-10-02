'use client';

import { AdminTools } from './admin-tools';

export function AdminHeader() {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1" />

        <div className="flex items-center gap-4">
          <AdminTools />
          <div className="flex items-center gap-2 text-slate-600">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              Y
            </div>
            <span className="text-sm font-medium">Yönetici</span>
          </div>
        </div>
      </div>
    </header>
  );
}