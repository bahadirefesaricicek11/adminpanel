'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/admin/stat-card';
import { Briefcase, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getDashboardStats } from '@/lib/supabase/queries';
import { translations } from '@/lib/translations';

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
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 border-b border-[#12242a]/10 pb-6 md:flex-row md:items-end">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4e8790]">Genel bakış</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#12242a]">{translations.dashboard.title}</h1><p className="mt-2 text-sm text-[#12242a]/55">{translations.dashboard.subtitle}</p></div>
        <div className="text-xs font-medium text-[#12242a]/45">Son güncelleme · şimdi</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title={translations.dashboard.totalRevenue}
          value={loading ? '...' : `₺${stats.totalRevenue.toLocaleString('tr-TR')}`}
          icon={DollarSign}
          trend="up"
          trendValue="%12.5"
          description={translations.dashboard.lastMonth}
        />
        <StatCard
          title={translations.dashboard.totalJobs}
          value={loading ? '...' : stats.totalJobs}
          icon={Briefcase}
          description={translations.dashboard.allCustomers}
        />
        <StatCard
          title={translations.dashboard.activeJobs}
          value={loading ? '...' : stats.totalJobs - stats.completedJobs}
          icon={Clock}
          description={translations.dashboard.ongoingProjects}
        />
        <StatCard
          title={translations.dashboard.completedJobs}
          value={loading ? '...' : stats.completedJobs}
          icon={CheckCircle}
          description={translations.dashboard.successfullyCompleted}
        />
      </div>

      <Card className="border-[#12242a]/10 bg-[#f8faf5] shadow-[0_8px_24px_rgba(18,36,42,0.05)]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#12242a]">{translations.dashboard.monthlyRevenue}</CardTitle>
        </CardHeader>
        <CardContent className="h-80 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d8e0d4" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#688078', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#688078', fontSize: 12 }} />
              <Tooltip formatter={(value) => [`₺${Number(value).toLocaleString('tr-TR')}`, 'Gelir']} />
              <Bar dataKey="revenue" fill="#b7dc32" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}