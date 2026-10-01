'use client';

import { StatCard } from '@/components/admin/stat-card';
import { Card } from '@/components/ui/card';
import { Briefcase, Users, DollarSign, TrendingUp, Plus, Eye, Edit2, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ScatterChart, Scatter } from 'recharts';
import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/lib/supabase/queries';

const trendData = [
  { month: 'Jan', jobs: 24, revenue: 12000, completion: 85 },
  { month: 'Feb', jobs: 32, revenue: 15000, completion: 88 },
  { month: 'Mar', jobs: 28, revenue: 14000, completion: 90 },
  { month: 'Apr', jobs: 41, revenue: 18000, completion: 92 },
  { month: 'May', jobs: 35, revenue: 16500, completion: 94 },
  { month: 'Jun', jobs: 48, revenue: 22000, completion: 96 },
];

const recentJobs = [
  { id: 1, name: 'Kitchen Renovation', status: 'In Progress', completion: 75, customer: 'John Smith' },
  { id: 2, name: 'Exterior Paint - Residential', status: 'Pending', completion: 0, customer: 'Sarah Johnson' },
  { id: 3, name: 'Commercial Building Paint', status: 'Completed', completion: 100, customer: 'Tech Corp Inc' },
  { id: 4, name: 'Bedroom Interior Paint', status: 'In Progress', completion: 45, customer: 'Mike Davis' },
  { id: 5, name: 'Office Wall Paint', status: 'Scheduled', completion: 0, customer: 'Business Solutions' },
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
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back to PaintCo Management System</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
          <Plus size={20} />
          New Job
        </button>
      </div>

      {/* Key Metrics */}
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
          title="Total Revenue"
          value={loading ? '-' : `$${(stats.totalRevenue / 1000).toFixed(1)}k`}
          description="Earnings this period"
          icon={DollarSign}
          trend="up"
          trendValue="8% growth"
          color="purple"
        />
        <StatCard
          title="Pending Jobs"
          value={loading ? '-' : stats.pendingJobs}
          description="Awaiting completion"
          icon={Clock}
          trend="down"
          trendValue="2 less than last month"
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart - Revenue Trend */}
        <Card className="lg:col-span-2 p-6 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Revenue Trend</h2>
            <span className="text-sm text-slate-600">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1' }}
                formatter={(value) => `$${value}`}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRevenue)"
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Completion Rate Card */}
        <Card className="p-6 border border-blue-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Completion Rate</h2>
          <div className="space-y-4">
            {[
              { month: 'January', rate: 85, color: 'bg-blue-700' },
              { month: 'February', rate: 88, color: 'bg-blue-600' },
              { month: 'March', rate: 90, color: 'bg-green-600' },
            ].map((item) => (
              <div key={item.month}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700">{item.month}</span>
                  <span className="text-sm font-bold text-blue-700">{item.rate}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color} transition-all`}
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Jobs Performance & Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs vs Completion */}
        <Card className="p-6 border border-blue-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Jobs Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1' }} />
              <Legend />
              <Bar dataKey="jobs" fill="#3b82f6" name="Jobs Completed" radius={[8, 8, 0, 0]} />
              <Bar dataKey="completion" fill="#10b981" name="Completion %" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Jobs List */}
        <Card className="p-6 border border-blue-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Jobs</h2>
          <div className="space-y-3">
            {recentJobs.slice(0, 4).map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{job.name}</p>
                  <p className="text-sm text-slate-600">{job.customer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    job.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    job.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    job.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
            View All Jobs
          </button>
        </Card>
      </div>

      {/* Quick Stats Summary */}
      <Card className="p-6 border border-blue-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Team Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-700">{stats.totalUsers || 0}</div>
            <p className="text-slate-600 mt-1">Total Team Members</p>
            <p className="text-sm text-slate-500">Across all departments</p>
          </div>
          <div className="text-center border-l border-r border-slate-200">
            <div className="text-3xl font-bold text-green-700">{stats.completedJobs || 0}</div>
            <p className="text-slate-600 mt-1">Completed Jobs</p>
            <p className="text-sm text-slate-500">This period</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-700">${(stats.totalRevenue / 1000).toFixed(1)}k</div>
            <p className="text-slate-600 mt-1">Total Revenue</p>
            <p className="text-sm text-slate-500">Year to date</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
