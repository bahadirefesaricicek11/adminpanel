'use client';

import { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, RotateCcw, Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchJobs, deleteJob } from '@/lib/supabase/queries';
import { AddJobModal } from '@/components/admin/add-job-modal';
import { EditJobModal } from '@/components/admin/edit-job-modal';
import { JobDetailsDrawer } from '@/components/admin/job-details-drawer';
import { exportToCSV } from '@/lib/utils/export';

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

const ITEMS_PER_PAGE = 10;

const statusConfig = {
  pending: { className: 'border-amber-200 bg-amber-50 text-amber-700', text: '⏳ Pending' },
  'in-progress': { className: 'border-blue-200 bg-blue-50 text-blue-700', text: '🔄 In Progress' },
  completed: { className: 'border-emerald-200 bg-emerald-50 text-emerald-700', text: '✓ Completed' },
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Drawer
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    try {
      const data = await fetchJobs();
      setJobs(
        data.map((job) => ({
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
        }))
      );
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }

  // Live Filtered Data
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.customer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus ? job.status === selectedStatus : true;
      const matchesType = selectedType ? job.type === selectedType : true;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [jobs, searchQuery, selectedStatus, selectedType]);

  // Paginated Data
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('');
    setSelectedType('');
    setCurrentPage(1);
  };

  // Bulk Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedJobs.map((j) => j.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Single Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    const success = await deleteJob(id);
    if (success) {
      setJobs((prev) => prev.filter((job) => job.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      toast.success('Job deleted successfully');
    } else {
      toast.error('Failed to delete job');
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} selected jobs?`)) return;

    let successCount = 0;
    for (const id of selectedIds) {
      const ok = await deleteJob(id);
      if (ok) successCount++;
    }

    setJobs((prev) => prev.filter((job) => !selectedIds.includes(job.id)));
    setSelectedIds([]);
    toast.success(`Deleted ${successCount} jobs`);
  };

  // Export Filtered Data
  const handleExport = () => {
    exportToCSV(filteredJobs, `jobs-export-${new Date().toISOString().slice(0, 10)}`);
    toast.success('CSV exported successfully');
  };

  const handleJobUpdated = (updatedJob: Job) => {
    setJobs((prev) => prev.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
    setEditingJob(null);
    toast.success('Job updated successfully');
  };

  const handleJobCreated = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    toast.success('New job created successfully');
  };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={paginatedJobs.length > 0 && selectedIds.length === paginatedJobs.length}
          className="rounded border-slate-300 accent-blue-600"
        />
      ),
      accessor: 'id' as const,
      cell: (id: string) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(id)}
          onChange={() => handleSelectRow(id)}
          className="rounded border-slate-300 accent-blue-600"
        />
      ),
    },
    { header: 'Job Title', accessor: 'title' as const },
    { header: 'Customer', accessor: 'customer' as const },
    {
      header: 'Type',
      accessor: 'type' as const,
      cell: (value: string) => (
        <Badge variant="outline" className="border-slate-200 text-slate-700 bg-slate-50 font-medium">
          {value}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      cell: (value: string) => {
        const config = statusConfig[value as keyof typeof statusConfig] || {
          className: 'border-slate-200 bg-slate-50 text-slate-700',
          text: value,
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
            {config.text}
          </span>
        );
      },
    },
    {
      header: 'Progress',
      accessor: 'progress' as const,
      cell: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${value}%` }} />
          </div>
          <span className="text-xs text-slate-500 font-medium w-8 text-right">%{value}</span>
        </div>
      ),
    },
    {
      header: 'Budget',
      accessor: 'budget' as const,
      cell: (value: number) => (
        <span className="font-medium text-slate-900">₺{value?.toLocaleString('tr-TR') || 0}</span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: (_: string, row: Job) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setViewingJob(row)}
            className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <Eye size={15} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditingJob(row)}
            className="h-8 w-8 p-0 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
          >
            <Pencil size={15} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(row.id)}
            className="h-8 w-8 p-0 text-slate-600 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 size={15} />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500 text-sm font-medium">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Jobs</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage all painting projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2 text-slate-700 border-slate-200">
            <Download size={16} /> Export CSV
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
            <Plus size={18} /> New Job
          </Button>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by job title or customer..."
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200/80 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3.5 py-2 text-sm bg-white border border-slate-200/80 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3.5 py-2 text-sm bg-white border border-slate-200/80 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
        >
          <option value="">All Types</option>
          <option value="interior">Interior</option>
          <option value="exterior">Exterior</option>
          <option value="commercial">Commercial</option>
          <option value="other">Other</option>
        </select>

        {(searchQuery || selectedStatus || selectedType) && (
          <Button variant="outline" onClick={handleResetFilters} className="gap-2 text-slate-600 border-slate-200 hover:bg-slate-100">
            <RotateCcw size={16} /> Reset
          </Button>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">{selectedIds.length} item(s) selected</span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="gap-2 bg-red-600 hover:bg-red-700">
            <Trash2 size={15} /> Delete Selected
          </Button>
        </div>
      )}

      {/* Table */}
      <DataTable columns={columns} data={paginatedJobs} />

      {/* Pagination Bar */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-500">
          Showing {paginatedJobs.length} of {filteredJobs.length} results
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-xs font-semibold text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="h-8 w-8 p-0"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Modals & Drawers */}
      <AddJobModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={handleJobCreated} />

      {editingJob && (
        <EditJobModal job={editingJob} isOpen={!!editingJob} onClose={() => setEditingJob(null)} onSuccess={handleJobUpdated} />
      )}

      <JobDetailsDrawer job={viewingJob} isOpen={!!viewingJob} onClose={() => setViewingJob(null)} />
    </div>
  );
}