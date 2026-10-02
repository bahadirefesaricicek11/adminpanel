'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { Activity, BarChart3, Clock, Users } from 'lucide-react';

interface ActivityRow { action: string; status: string; timestamp: string; user_email: string; }
export default function AnalyticsPage() {
  const [logs, setLogs] = useState<ActivityRow[]>([]);
  const supabase = createClient();
  useEffect(() => { supabase.from('activity_logs').select('action,status,timestamp,user_email').order('timestamp', { ascending: false }).limit(1000).then(({ data }) => setLogs(data ?? [])); }, []);
  const success = logs.filter((log) => log.status === 'success').length;
  const users = new Set(logs.map((log) => log.user_email)).size;
  const actionCounts = logs.reduce<Record<string, number>>((result, log) => { result[log.action] = (result[log.action] || 0) + 1; return result; }, {});
  const topActions = Object.entries(actionCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  return <div className="space-y-6"><div><h1 className="text-3xl font-bold text-slate-900">Analitik ve Raporlar</h1><p className="text-sm text-slate-600 mt-1">Admin kullanımını ve işlem performansını izleyin.</p></div><div className="grid grid-cols-1 md:grid-cols-4 gap-4"><Metric icon={Activity} label="Toplam İşlem" value={logs.length} /><Metric icon={BarChart3} label="Başarılı İşlem" value={success} /><Metric icon={Users} label="Aktif Kullanıcı" value={users} /><Metric icon={Clock} label="Başarı Oranı" value={`${logs.length ? Math.round(success / logs.length * 100) : 0}%`} /></div><Card><CardHeader><CardTitle>En Sık İşlemler</CardTitle></CardHeader><CardContent className="space-y-4">{topActions.map(([action, count]) => <div key={action}><div className="flex justify-between text-sm mb-1"><span className="text-slate-700">{action}</span><span className="font-semibold">{count}</span></div><div className="h-2 bg-slate-100 rounded-full"><div className="h-2 bg-blue-600 rounded-full" style={{ width: `${logs.length ? Math.max(4, count / logs.length * 100) : 0}%` }} /></div></div>)}</CardContent></Card></div>;
}
function Metric({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: string | number }) { return <Card><CardContent className="p-5"><Icon size={20} className="text-blue-700 mb-3" /><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-bold text-slate-900 mt-1">{value}</p></CardContent></Card>; }
