// app/admin/login/layout.tsx
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login sayfası için Sidebar veya AdminProtection ÇALIŞTIRMAZ
  return <>{children}</>;
}