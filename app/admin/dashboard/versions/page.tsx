'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { History, RotateCcw } from 'lucide-react';

interface Version { id: string; created_by_email: string | null; change_note: string | null; snapshot: Record<string, unknown>; created_at: string; }
export default function VersionsPage() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [message, setMessage] = useState('');
  const supabase = createClient();
  useEffect(() => { supabase.from('content_versions').select('*').order('created_at', { ascending: false }).limit(50).then(({ data }) => setVersions(data ?? [])); }, []);
  const restore = async (version: Version) => { const { data: content } = await supabase.from('website_content').select('id').limit(1).maybeSingle(); if (!content) return setMessage('İçerik kaydı bulunamadı.'); const snapshot = { ...version.snapshot, id: content.id, updated_at: new Date().toISOString() }; const { error } = await supabase.from('website_content').upsert(snapshot); setMessage(error ? 'Geri yükleme başarısız.' : 'Sürüm geri yüklendi.'); };
  return <div className="space-y-6"><div><h1 className="text-3xl font-bold text-slate-900">Sürüm Geçmişi</h1><p className="text-sm text-slate-600 mt-1">İçerik değişikliklerini inceleyin ve önceki sürümleri geri yükleyin.</p></div>{message && <p className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg">{message}</p>}<Card><CardHeader><CardTitle className="flex gap-2 items-center"><History size={18} /> İçerik Sürümleri</CardTitle></CardHeader><CardContent className="space-y-3">{versions.length === 0 ? <p className="py-8 text-center text-slate-500">Henüz kaydedilmiş sürüm yok.</p> : versions.map((version) => <div key={version.id} className="flex items-center justify-between border rounded-lg p-4"><div><p className="font-semibold">{version.change_note || 'İçerik güncellemesi'}</p><p className="text-sm text-slate-500">{version.created_by_email || 'Bilinmeyen kullanıcı'} · {new Date(version.created_at).toLocaleString('tr-TR')}</p></div><Button variant="outline" size="sm" className="gap-2" onClick={() => restore(version)}><RotateCcw size={15} /> Geri Yükle</Button></div>)}</CardContent></Card></div>;
}
