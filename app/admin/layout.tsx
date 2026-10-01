import { AdminProtection } from '@/components/admin/protection';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtection>
      {children}
    </AdminProtection>
  );
}