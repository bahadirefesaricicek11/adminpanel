'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Search, RefreshCw, Download } from 'lucide-react';

interface ActivityLog {
  id: string;
  user_email: string;
  action: string;
  resource_type: string | null;
  resource_name: string | null;
  status: string;
  timestamp: string;
  ip_address: string | null;
  error_message: string | null;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const supabase = createClient();

  const loadLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('activity_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(500);

      // Apply filters
      if (searchTerm) {
        query = query.or(`user_email.ilike.%${searchTerm}%,resource_name.ilike.%${searchTerm}%`);
      }

      if (filterAction) {
        query = query.eq('action', filterAction);
      }

      if (filterStatus) {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error('Error loading activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleSearch = () => {
    loadLogs();
  };

  const handleExport = () => {
    const csv = [
      ['Tarihsaat', 'Kullanıcı', 'İşlem', 'Kaynak Türü', 'Kaynak Adı', 'Durum', 'IP Adresi', 'Hata'].join(','),
      ...logs.map((log) =>
        [
          new Date(log.timestamp).toLocaleString('tr-TR'),
          log.user_email,
          log.action,
          log.resource_type || '-',
          log.resource_name || '-',
          log.status,
          log.ip_address || '-',
          log.error_message || '-',
        ]
          .map((field) => `"${field}"`)
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString()}.csv`;
    a.click();
  };

  const actionStats = Array.from(new Set(logs.map((l) => l.action)));
  const statusStats = Array.from(new Set(logs.map((l) => l.status)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Faaliyet Günlükleri</h1>
        <p className="text-sm text-slate-600 mt-1">Admin panelindeki tüm kullanıcı etkinliklerini izleyin</p>
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Filtreler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Ara</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Kullanıcı veya kaynak..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSearch}
                  className="bg-blue-700 hover:bg-blue-800"
                  disabled={loading}
                >
                  <Search size={18} />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">İşlem</label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tümü</option>
                {actionStats.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Durum</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tümü</option>
                {statusStats.map((status) => (
                  <option key={status} value={status}>
                    {status === 'success' ? 'Başarılı' : 'Hata'}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setFilterAction('');
                  setFilterStatus('');
                }}
                variant="outline"
                className="flex-1 border-slate-200 hover:bg-slate-50"
              >
                Sıfırla
              </Button>
              <Button
                onClick={handleExport}
                className="flex-1 bg-green-700 hover:bg-green-800 gap-2"
              >
                <Download size={18} />
                CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Etkinlik Kaydı</CardTitle>
            <Button
              onClick={loadLogs}
              disabled={loading}
              variant="outline"
              className="gap-2 border-slate-200"
              size="sm"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Yenile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-600">Yükleniyor...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-slate-600">Hiç etkinlik bulunamadı</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Tarih &amp; Saat</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Kullanıcı</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">İşlem</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Kaynak</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Durum</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">IP Adresi</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {new Date(log.timestamp).toLocaleString('tr-TR')}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">{log.user_email}</td>
                      <td className="px-4 py-3 text-slate-700">{log.action}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">
                        {log.resource_type && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {log.resource_type}: {log.resource_name}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            log.status === 'success'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {log.status === 'success' ? 'Başarılı' : 'Hata'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 font-mono">
                        {log.ip_address || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Stats Footer */}
          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{logs.length}</p>
              <p className="text-xs text-slate-600">Toplam Etkinlik</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {logs.filter((l) => l.status === 'success').length}
              </p>
              <p className="text-xs text-slate-600">Başarılı</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {logs.filter((l) => l.status === 'error').length}
              </p>
              <p className="text-xs text-slate-600">Hata</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
