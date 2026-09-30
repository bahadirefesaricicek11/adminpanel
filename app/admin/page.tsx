'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/admin/stat-card';
import { Briefcase, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const mockJobs = [
  { id: '1', title: 'Villa Dış Cephe Boyama', status: 'completed', budget: 45000 },
  { id: '2', title: 'Ofis Kompleksi İç Mekan', status: 'in-progress', budget: 120000 },
  { id: '3', title: 'Konut Daire Boyama', status: 'pending', budget: 28000 },
  { id: '4', title: 'Mağaza Tadilatı & Rötuş', status: 'completed', budget: 15000 },
];

const monthlyRevenue = [
  { month: 'Ock', revenue: 32000 },
  { month: 'Şub', revenue: 45000 },
  { month: 'Mar', revenue: 58000 },
  { month: 'Nis', revenue: 80000 },
  { month: 'May', revenue: 95000 },
  { month: 'Haz', revenue: 120000 },
];

export default function AdminDashboardPage() {
  const stats = useMemo(() => {
    const totalJobs = mockJobs.length;
    const completed = mockJobs.filter((j) => j.status === 'completed').length;
    const active = mockJobs.filter((j) => j.status === 'in-progress').length;
    const totalBudget = mockJobs.reduce((acc, j) => acc + j.budget, 0);

    return { totalJobs, completed, active, totalBudget };
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
          value={`₺${stats.totalBudget.toLocaleString('tr-TR')}`}
          icon={DollarSign}
          trend="up"
          trendValue="%12.5"
          description="Geçen aya göre"
        />
        <StatCard
          title="Toplam Proje"
          value={stats.totalJobs}
          icon={Briefcase}
          description="Tüm müşteriler geneli"
        />
        <StatCard
          title="Aktif İşler"
          value={stats.active}
          icon={Clock}
          description="Devam eden projeler"
        />
        <StatCard
          title="Tamamlanan"
          value={stats.completed}
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