'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/admin/stat-card';
import { Briefcase, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getDashboardStats } from '@/lib/supabase/queries';

const monthlyRevenue = [
  { month: 'Ock', revenue: 32000 },
  { month: 'Şub', revenue: 45000 },
  { month: 'Mar', revenue: 58000 },
  { month: 'Nis', revenue: 80000 },
  { month: 'May', revenue: 95000 },
  { month: 'Haz', revenue: 120000 },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalJobs: 0,
    completedJobs: 0,
    pendingJobs: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kontrol Paneli</h1>
        <p className="text-sm text-slate-500">Genel performans metrikleri ve gelir istatistikleri</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Gelir"
          value={loading ? '...' : `₺${stats.totalRevenue.toLocaleString('tr-TR')}`}
          icon={DollarSign}
          trend="up"
          trendValue="%12.5"
          description="Geçen aya göre"
        />
        <StatCard
          title="Toplam Proje"
          value={loading ? '...' : stats.totalJobs}
          icon={Briefcase}
          description="Tüm müşteriler geneli"
        />
        <StatCard
          title="Aktif İşler"
          value={loading ? '...' : stats.totalJobs - stats.completedJobs}
          icon={Clock}
          description="Devam eden projeler"
        />
        <StatCard
          title="Tamamlanan"
          value={loading ? '...' : stats.completedJobs}
          icon={CheckCircle}
          description="Başarıyla bitirildi"
        />
      </div>

      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">Aylık Gelir Dağılımı</CardTitle>
        </CardHeader>
        <CardContent className="h-72 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip formatter={(value) => [`₺${Number(value).toLocaleString('tr-TR')}`, 'Gelir']} />
              <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}