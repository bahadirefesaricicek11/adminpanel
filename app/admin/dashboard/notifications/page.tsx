'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Bell, CheckCheck } from 'lucide-react';

interface Notification { id: string; title: string; message: string; type: string; link: string | null; read_at: string | null; created_at: string; }
export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const supabase = createClient();
  const load = async () => { const { data } = await supabase.from('admin_notifications').select('*').order('created_at', { ascending: false }).limit(100); setItems(data ?? []); };
  useEffect(() => { load(); }, []);
  const markRead = async (id: string) => { await supabase.from('admin_notifications').update({ read_at: new Date().toISOString() }).eq('id', id); load(); };
  const markAll = async () => { await supabase.from('admin_notifications').update({ read_at: new Date().toISOString() }).is('read_at', null); load(); };
  return <div className="space-y-6"><div className="flex justify-between items-start"><div><h1 className="text-3xl font-bold text-slate-900">Bildirimler</h1><p className="text-sm text-slate-600 mt-1">Sistem ve ekip bildirimlerini takip edin.</p></div><Button onClick={markAll} variant="outline" className="gap-2"><CheckCheck size={16} /> Tümünü Okundu İşaretle</Button></div><Card><CardHeader><CardTitle className="flex items-center gap-2"><Bell size={18} /> Bildirim Merkezi</CardTitle></CardHeader><CardContent className="space-y-2">{items.length === 0 ? <p className="py-8 text-center text-slate-500">Yeni bildirim yok.</p> : items.map((item) => <div key={item.id} className={`flex items-start justify-between gap-4 border rounded-lg p-4 ${item.read_at ? 'bg-white' : 'bg-blue-50 border-blue-200'}`}><div><p className="font-semibold text-slate-900">{item.title}</p><p className="text-sm text-slate-600 mt-1">{item.message}</p><p className="text-xs text-slate-400 mt-2">{new Date(item.created_at).toLocaleString('tr-TR')}</p></div>{!item.read_at && <Button size="sm" variant="outline" onClick={() => markRead(item.id)}>Okundu</Button>}</div>)}</CardContent></Card></div>;
}
