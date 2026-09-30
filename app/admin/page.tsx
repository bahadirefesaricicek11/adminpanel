'use client';

import { StatCard } from '@/components/admin/stat-card';
import { Card } from '@/components/ui/card';
import { Briefcase, Users, DollarSign, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState } from 'react';
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
  { name: 'Interior', value: 45, color: '#1e40af' },
  { name: 'Exterior', value: 30, color: '#06b6d4' },
  { name: 'Commercial', value: 25, color: '#0ea5e9' },
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

  useEffect(() => {
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome back to PaintCo Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          color="green"
        />
        <StatCard
          title="Revenue"
          value={loading ? '-' : `$${(stats.totalRevenue / 1000).toFixed(1)}k`}
          description="Total earnings"
          icon={DollarSign}
          trend="up"
          trendValue="8% growth"
          color="purple"
        />
        <StatCard
          title="Pending Jobs"
          value={loading ? '-' : stats.pendingJobs}
          description="Awaiting completion"
          icon={TrendingUp}
          trend="down"
          trendValue="2 less than last month"
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card className="lg:col-span-2 p-6 border-2 border-blue-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Jobs & Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis yAxisId="left" stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '8px' }} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="jobs"
                stroke="#1e40af"
                strokeWidth={3}
                dot={{ fill: '#1e40af', r: 5 }}
                activeDot={{ r: 7 }}
                name="Jobs Completed"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', r: 5 }}
                activeDot={{ r: 7 }}
                name="Revenue ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card className="p-6 border-2 border-blue-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Job Types</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name} ${entry.value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {jobTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card className="p-6 border-2 border-blue-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Monthly Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dashboardData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db' }} />
            <Legend />
            <Bar dataKey="jobs" fill="#1e40af" name="Jobs" radius={[8, 8, 0, 0]} />
            <Bar dataKey="revenue" fill="#0ea5e9" name="Revenue ($)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
