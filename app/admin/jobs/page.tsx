'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Briefcase, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { AddJobModal } from '@/components/admin/add-job-modal';

interface Job {
  id: string;
  title: string;
  client: string;
  status: 'beklemede' | 'devam_ediyor' | 'tamamlandi';
  budget: number;
  startDate: string;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Villa Dış Cephe Boyama',
    client: 'Ahmet Yılmaz',
    status: 'tamamlandi',
    budget: 45000,
    startDate: '2026-08-10',
  },
  {
    id: '2',
    title: 'Ofis Kompleksi İç Mekan',
    client: 'Mehmet Demir',
    status: 'devam_ediyor',
    budget: 120000,
    startDate: '2026-09-01',
  },
  {
    id: '3',
    title: 'Konut Daire Boyama',
    client: 'Ayşe Kaya',
    status: 'beklemede',
    budget: 28000,
    startDate: '2026-10-05',
  },
  {
    id: '4',
    title: 'Mağaza Tadilatı & Rötuş',
    client: 'Can Öztürk',
    status: 'tamamlandi',
    budget: 15000,
    startDate: '2026-07-15',
  },
];

const statusBadges = {
  beklemede: {
    label: 'Beklemede',
    variant: 'outline' as const,
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: AlertCircle,
  },
  devam_ediyor: {
    label: 'Devam Ediyor',
    variant: 'outline' as const,
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Clock,
  },
  tamamlandi: {
    label: 'Tamamlandı',
    variant: 'outline' as const,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
};

export default function JobsPage() {
  const [jobs] = useState<Job[]>(mockJobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('hepsi');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.client.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        selectedStatus === 'hepsi' || job.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">İşler & Projeler</h1>
          <p className="text-sm text-slate-500">Mevcut projeleri, durumları ve bütçeleri yönetin</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          <Plus size={16} /> Yeni İş Ekle
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input
            placeholder="İş başlığı veya müşteri ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-600"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          <Filter size={16} className="text-slate-400 mr-2 shrink-0 hidden sm:block" />
          {[
            { key: 'hepsi', label: 'Tümü' },
            { key: 'devam_ediyor', label: 'Devam Ediyor' },
            { key: 'beklemede', label: 'Beklemede' },
            { key: 'tamamlandi', label: 'Tamamlandı' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatus(tab.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedStatus === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => {
          const statusConfig = statusBadges[job.status];
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={job.id}
              className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-900 text-base line-clamp-1">{job.title}</h3>
                <Badge
                  variant={statusConfig.variant}
                  className={`shrink-0 font-medium ${statusConfig.className}`}
                >
                  <StatusIcon size={12} className="mr-1" /> {statusConfig.label}
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Müşteri:</span>
                  <span className="font-semibold text-slate-800">{job.client}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Başlangıç Tarihi:</span>
                  <span className="font-medium text-slate-700">{job.startDate}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Bütçe
                </span>
                <span className="font-bold text-slate-900 text-base">
                  ₺{job.budget.toLocaleString('tr-TR')}
                </span>
              </div>
            </div>
          );
        })}

        {filteredJobs.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-200 text-slate-500">
            <Briefcase size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium">Arama kriterlerinize uygun iş bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Modal Integration */}
      <AddJobModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}