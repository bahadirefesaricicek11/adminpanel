'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { UserPlus, ShieldCheck } from 'lucide-react';

type Role = 'owner' | 'admin' | 'editor' | 'viewer';
interface Profile { user_id: string; display_name: string | null; role: Role; is_active: boolean; }

export default function RolesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('viewer');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  const loadProfiles = async () => {
    const { data } = await supabase.from('admin_profiles').select('*').order('created_at', { ascending: false });
    setProfiles(data ?? []);
  };

  useEffect(() => { loadProfiles(); }, []);

  const inviteUser = async () => {
    if (!email.includes('@')) return setMessage('Geçerli bir e-posta girin.');
    const response = await fetch('/api/admin/invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    const result = await response.json();
    setMessage(result.message || 'Davet oluşturulamadı.');
    if (response.ok) setEmail('');
  };

  const updateRole = async (userId: string, nextRole: Role) => {
    await supabase.from('admin_profiles').update({ role: nextRole, updated_at: new Date().toISOString() }).eq('user_id', userId);
    loadProfiles();
  };

  return <div className="space-y-6">
    <div><h1 className="text-3xl font-bold text-slate-900">Roller ve Yetkiler</h1><p className="text-sm text-slate-600 mt-1">Ekip erişimini yönetin ve yeni kullanıcı davetleri oluşturun.</p></div>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><UserPlus size={18} /> Kullanıcı Davet Et</CardTitle></CardHeader><CardContent className="flex flex-col md:flex-row gap-3">
      <Input type="email" placeholder="kullanici@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="border border-slate-200 rounded-lg px-3"><option value="admin">Yönetici</option><option value="editor">Editör</option><option value="viewer">Görüntüleyici</option></select>
      <Button onClick={inviteUser} className="gap-2 bg-blue-700 hover:bg-blue-800"><UserPlus size={16} /> Davet Oluştur</Button>
    </CardContent>{message && <p className="px-6 pb-5 text-sm text-blue-700">{message}</p>}</Card>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck size={18} /> Ekip Rolleri</CardTitle></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="py-3">Kullanıcı</th><th>Rol</th><th>Durum</th><th>Değiştir</th></tr></thead><tbody>{profiles.map((profile) => <tr key={profile.user_id} className="border-b"><td className="py-3">{profile.display_name || 'İsimsiz kullanıcı'}</td><td>{profile.role}</td><td>{profile.is_active ? 'Aktif' : 'Pasif'}</td><td><select value={profile.role} onChange={(e) => updateRole(profile.user_id, e.target.value as Role)} className="border rounded px-2 py-1"><option value="owner">Sahip</option><option value="admin">Yönetici</option><option value="editor">Editör</option><option value="viewer">Görüntüleyici</option></select></td></tr>)}</tbody></table></div></CardContent></Card>
  </div>;
}
