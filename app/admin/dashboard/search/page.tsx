'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Result { id: string; section: string; title: string; body: string; }
export default function SearchPage() {
  const params = useSearchParams();
  const query = params.get('q') || '';
  const [results, setResults] = useState<Result[]>([]);
  const supabase = createClient();
  useEffect(() => { if (!query.trim()) return; supabase.from('content_search_index').select('id,section,title,body').textSearch('search_document', query, { type: 'websearch' }).limit(50).then(({ data }) => setResults(data ?? [])); }, [query]);
  return <div className="space-y-6"><div><h1 className="text-3xl font-bold text-slate-900">İçerik Arama</h1><p className="text-sm text-slate-600 mt-1">Arama sonuçları: {query || 'Bir arama terimi girin'}</p></div><Card><CardHeader><CardTitle className="flex items-center gap-2"><Search size={18} /> Sonuçlar</CardTitle></CardHeader><CardContent className="space-y-3">{results.length === 0 ? <p className="py-8 text-center text-slate-500">Sonuç bulunamadı.</p> : results.map((result) => <Link key={result.id} href="/admin/dashboard/content" className="block border rounded-lg p-4 hover:bg-slate-50"><span className="text-xs text-blue-700">{result.section}</span><h2 className="font-semibold text-slate-900 mt-1">{result.title}</h2><p className="text-sm text-slate-600 mt-1">{result.body}</p></Link>)}</CardContent></Card></div>;
}
