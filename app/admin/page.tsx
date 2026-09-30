import { redirect } from 'next/navigation';

export default function AdminRootPage() {
  // Kullanıcı admin kök dizinine geldiğinde doğrudan dashboard'a (veya login'e) yönlendirilir
  redirect('/admin/dashboard');
}