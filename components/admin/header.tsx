'use client';

import { AdminTools } from './admin-tools';

export function AdminHeader() {
  return (
    <header className="border-b border-[#12242a]/10 bg-[#f8faf5] px-5 py-4 md:px-8">
      <div className="flex items-center justify-between">
        <div className="flex-1" />

        <div className="flex items-center gap-4">
          <AdminTools />
          <div className="flex items-center gap-2 text-[#12242a]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9ff4f] text-sm font-bold">
              Y
            </div>
            <div className="hidden text-right sm:block"><p className="text-sm font-semibold">Yönetici</p><p className="text-[11px] text-[#12242a]/45">Kontrol merkezi</p></div>
          </div>
        </div>
      </div>
    </header>
  );
}