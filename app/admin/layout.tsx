import { AdminProtection } from '@/components/admin/protection';
import { ErrorBoundary } from '@/components/error-boundary';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <AdminProtection>
        {children}
      </AdminProtection>
    </ErrorBoundary>
  );
}