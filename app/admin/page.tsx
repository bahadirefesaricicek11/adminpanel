'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/admin/stat-card';
import { Card } from '@/components/ui/card';
import { Briefcase, Users, DollarSign, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getDashboardStats } from '@/lib/supabase/queries';

const dashboardData = [
  { month: 'Oca', jobs: 24, revenue: 12000 },
  { month: 'Şub', jobs: 32, revenue: 15000 },
  { month: 'Mar', jobs: 28, revenue: 14000 },
  { month: 'Nis', jobs: 41, revenue: 18000 },
  { month: 'May', jobs: 35, revenue: 16500 },
  { month: 'Haz', jobs: 48, revenue: 22000 },
];

const jobTypeData = [
  { name: 'İç Mekan', value: 45, color: '#2563eb' }, // Vibrant Royal Blue
  { name: 'Dış Mekan', value: 30, color: '#38bdf8' }, // Light Sky Blue
  { name: 'Ticari', value: 25, color: '#818cf8' },   // Soft Indigo Accent
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalJobs: 0,
    completedJobs: 0,
    pendingJobs: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('İstatistikler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="min-h-screen space-y-8 bg-slate-50/60 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kontrol Paneli</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            PaintCo Yönetim Sistemine tekrar hoş geldiniz
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Sistem Aktif
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Toplam İş"
          value={loading ? '-' : stats.totalJobs}
          description={`${stats.completedJobs} tamamlandı`}
          icon={Briefcase}
          trend="up"
          trendValue="Geçen aya göre %12 artış"
          color="blue"
        />
        <StatCard
          title="Aktif Kullanıcılar"
          value={loading ? '-' : stats.activeUsers}
          description={`${stats.totalUsers} ekip üyesinden`}
          icon={Users}
          trend="up"
          trendValue="Bu ay 3 yeni üye"
          color="blue"
        />
        <StatCard
          title="Toplam Gelir"
          value={loading ? '-' : `₺${(stats.totalRevenue / 1000).toFixed(1)}b`}
          description="Toplam kazanç"
          icon={DollarSign}
          trend="up"
          trendValue="%8 büyüme"
          color="blue"
        />
        <StatCard
          title="Bekleyen İşler"
          value={loading ? '-' : stats.pendingJobs}
          description="Tamamlanmayı bekleyen"
          icon={TrendingUp}
          trend="down"
          trendValue="Geçen aya göre 2 eksik"
          color="blue"
        />
      </div>

      {/* Charts Grid */}
      {mounted && (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Line Chart */}
            <Card className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2">
              <h2 className="mb-4 text-base font-semibold text-slate-900">
                İş ve Gelir Trendi
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData}>
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} stroke="#94a3b8" fontSize={12} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} stroke="#94a3b8" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="jobs"
                    name="Tamamlanan İşler"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ fill: '#2563eb', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    name="Gelir (₺)"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    dot={{ fill: '#38bdf8', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Pie Chart */}
            <Card className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-slate-900">İş Türleri</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={jobTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name} %${value}`}
                    labelLine={false}
                  >
                    {jobTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Bar Chart */}
          <Card className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-900">Aylık Performans</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData}>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} stroke="#94a3b8" fontSize={12} />
                <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="jobs" name="İş Sayısı" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" name="Gelir (₺)" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  );
}