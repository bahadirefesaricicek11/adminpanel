'use server';

import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { fetchJobs, deleteJob } from '@/lib/supabase/queries';

interface Job {
  id: string;
  title: string;
  customer: string;
  type: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  start_date: string;
  due_date: string;
  budget: number;
}

const statusConfig = {
  pending: { badge: 'outline', text: '⏳ Pending' },
  'in-progress': { badge: 'default', text: '🔄 In Progress' },
  completed: { badge: 'default', text: '✓ Completed' },
};

export default async function JobsPage() {
  const jobs = await fetchJobs();

  const columns = [
    {
      header: 'Job Title',
      accessor: 'title' as const,
    },
    {
      header: 'Customer',
      accessor: 'customer' as const,
    },
    {
      header: 'Type',
      accessor: 'type' as const,
      cell: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      cell: (value: string) => {
        const config = statusConfig[value as keyof typeof statusConfig];
        return <Badge variant={config.badge as any}>{config.text}</Badge>;
      },
    },
    {
      header: 'Progress',
      accessor: 'progress' as const,
      cell: (value: number) => (
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${value}%` }}
          ></div>
        </div>
      ),
    },
    {
      header: 'Budget',
      accessor: 'budget' as const,
      cell: (value: number) => `$${value?.toLocaleString() || 0}`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Jobs</h1>
          <p className="text-slate-600 mt-1">Manage all painting projects</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} />
          New Job
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="search"
            placeholder="Search by job title or customer..."
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Types</option>
          <option value="interior">Interior</option>
          <option value="exterior">Exterior</option>
          <option value="commercial">Commercial</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={jobs.map((job) => ({
          ...job,
          id: job.id,
          title: job.title,
          customer: job.customer,
          type: job.type,
          status: job.status as 'pending' | 'in-progress' | 'completed',
          progress: job.progress || 0,
          start_date: job.start_date || '',
          due_date: job.due_date || '',
          budget: job.budget || 0,
        }))}
      />
    </div>
  );
}
