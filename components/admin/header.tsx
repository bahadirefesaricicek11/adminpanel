'use client';

import { AdminTools } from './admin-tools';

export function AdminHeader() {
  return (
    <header className="border-b border-[#dce8f3] bg-white px-5 py-4 md:px-8">
      <div className="flex items-center justify-between">
        <div className="flex-1" />

        <div className="flex items-center gap-4">
          <AdminTools />
          <div className="flex items-center gap-2 text-[#18324b]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9edff] text-sm font-bold text-[#2571c5]">
              Y
            </div>
            <div className="hidden text-right sm:block"><p className="text-sm font-semibold">Yönetici</p><p className="text-[11px] text-[#18324b]/45">Duvar boyama merkezi</p></div>
          </div>
        </div>
      </div>
    </header>
  );
}