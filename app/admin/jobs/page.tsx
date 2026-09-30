'use client';

import { useState } from 'react';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  customer: string;
  type: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  startDate: string;
  dueDate: string;
  budget: number;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Living Room Repaint',
    customer: 'John Smith',
    type: 'Interior',
    status: 'in-progress',
    progress: 75,
    startDate: '2024-06-01',
    dueDate: '2024-06-15',
    budget: 2500,
  },
  {
    id: '2',
    title: 'Office Building Exterior',
    customer: 'Tech Corp',
    type: 'Commercial',
    status: 'in-progress',
    progress: 45,
    startDate: '2024-05-20',
    dueDate: '2024-07-10',
    budget: 15000,
  },
  {
    id: '3',
    title: 'Bedroom Makeover',
    customer: 'Emily Johnson',
    type: 'Interior',
    status: 'completed',
    progress: 100,
    startDate: '2024-05-10',
    dueDate: '2024-05-25',
    budget: 1800,
  },
  {
    id: '4',
    title: 'House Exterior Paint',
    customer: 'Robert Williams',
    type: 'Exterior',
    status: 'pending',
    progress: 0,
    startDate: '2024-06-20',
    dueDate: '2024-07-05',
    budget: 4500,
  },
  {
    id: '5',
    title: 'Restaurant Renovation',
    customer: 'Taste Buds Restaurant',
    type: 'Commercial',
    status: 'in-progress',
    progress: 60,
    startDate: '2024-05-15',
    dueDate: '2024-06-30',
    budget: 8000,
  },
];

const statusConfig = {
  pending: { badge: 'outline', text: '⏳ Pending' },
  'in-progress': { badge: 'default', text: '🔄 In Progress' },
  completed: { badge: 'default', text: '✓ Completed' },
};

export default function JobsPage() {
  const [jobs, setJobs] = useState(mockJobs);

  const handleEdit = (job: Job) => {
    console.log('Edit job:', job);
    alert(`Edit functionality for ${job.title}`);
  };

  const handleDelete = (job: Job) => {
    setJobs(jobs.filter((j) => j.id !== job.id));
    alert(`Job ${job.title} deleted`);
  };

  const handleAddJob = () => {
    alert('Add job functionality');
  };

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
      cell: (value: number) => `$${value.toLocaleString()}`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Jobs</h1>
          <p className="text-slate-600 mt-1">Manage all painting projects</p>
        </div>
        <Button onClick={handleAddJob} className="gap-2">
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
        data={jobs}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
