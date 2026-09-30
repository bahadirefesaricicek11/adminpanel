// app/admin/layout.tsx
import { Sidebar } from '@/components/admin/sidebar';
import { AdminHeader } from '@/components/admin/header';
import { AdminProtection } from '@/components/admin/protection';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtection>
      <div className="flex h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-auto p-8">{children}</main>
        </div>
      </div>
    </AdminProtection>
  );
}