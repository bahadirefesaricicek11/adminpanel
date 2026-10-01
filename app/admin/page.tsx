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

export default function AdminPage() {
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
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{translations.dashboard.title}</h1>
        <p className="text-sm text-slate-600 mt-1">{translations.dashboard.subtitle}</p>
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

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">{translations.dashboard.monthlyRevenue}</CardTitle>
        </CardHeader>
        <CardContent className="h-80 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip formatter={(value) => [`₺${Number(value).toLocaleString('tr-TR')}`, 'Gelir']} />
              <Bar dataKey="revenue" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
