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
  { month: 'Jan', jobs: 24, revenue: 12000 },
  { month: 'Feb', jobs: 32, revenue: 15000 },
  { month: 'Mar', jobs: 28, revenue: 14000 },
  { month: 'Apr', jobs: 41, revenue: 18000 },
  { month: 'May', jobs: 35, revenue: 16500 },
  { month: 'Jun', jobs: 48, revenue: 22000 },
];

const jobTypeData = [
  { name: 'Interior', value: 45, color: '#1e3a8a' },
  { name: 'Exterior', value: 30, color: '#3b82f6' },
  { name: 'Commercial', value: 25, color: '#93c5fd' },
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
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="min-h-screen space-y-8 bg-slate-50/50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Welcome back to PaintCo Management System
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            System Operational
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Jobs"
          value={loading ? '-' : stats.totalJobs}
          description={`${stats.completedJobs} completed`}
          icon={Briefcase}
          trend="up"
          trendValue="12% from last month"
          color="blue"
        />
        <StatCard
          title="Active Users"
          value={loading ? '-' : stats.activeUsers}
          description={`of ${stats.totalUsers} team members`}
          icon={Users}
          trend="up"
          trendValue="3 new this month"
          color="blue"
        />
        <StatCard
          title="Revenue"
          value={loading ? '-' : `$${(stats.totalRevenue / 1000).toFixed(1)}k`}
          description="Total earnings"
          icon={DollarSign}
          trend="up"
          trendValue="8% growth"
          color="blue"
        />
        <StatCard
          title="Pending Jobs"
          value={loading ? '-' : stats.pendingJobs}
          description="Awaiting completion"
          icon={TrendingUp}
          trend="down"
          trendValue="2 less than last month"
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
                Jobs & Revenue Trend
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
                    name="Jobs Completed"
                    stroke="#1e3a8a"
                    strokeWidth={2.5}
                    dot={{ fill: '#1e3a8a', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue ($)"
                    stroke="#60a5fa"
                    strokeWidth={2.5}
                    dot={{ fill: '#60a5fa', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Pie Chart */}
            <Card className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-slate-900">Job Types</h2>
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
                    label={({ name, value }) => `${name} ${value}%`}
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
            <h2 className="mb-4 text-base font-semibold text-slate-900">Monthly Performance</h2>
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
                <Bar dataKey="jobs" name="Jobs" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" name="Revenue ($)" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  );
}