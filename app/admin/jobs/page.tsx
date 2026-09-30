'use client';

import { useEffect, useState } from 'react';
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
  pending: { badge: 'outline', text: '⏳ Beklemede' },
  'in-progress': { badge: 'default', text: '🔄 Devam Ediyor' },
  completed: { badge: 'default', text: '✓ Tamamlandı' },
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await fetchJobs();
        setJobs(data.map((job) => ({
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
        })));
      } catch (error) {
        console.error('İşler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  const columns = [
    {
      header: 'İş Başlığı',
      accessor: 'title' as const,
    },
    {
      header: 'Müşteri',
      accessor: 'customer' as const,
    },
    {
      header: 'Tür',
      accessor: 'type' as const,
      cell: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      header: 'Durum',
      accessor: 'status' as const,
      cell: (value: string) => {
        const config = statusConfig[value as keyof typeof statusConfig];
        return <Badge variant={config.badge as any}>{config.text}</Badge>;
      },
    },
    {
      header: 'İlerleme',
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
      header: 'Bütçe',
      accessor: 'budget' as const,
      cell: (value: number) => `₺${value?.toLocaleString('tr-TR') || 0}`,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-600">İşler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">İşler</h1>
          <p className="text-slate-600 mt-1">Tüm boya projelerini yönetin</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} />
          Yeni İş
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="search"
            placeholder="İş başlığı veya müşteri adı ile ara..."
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Tüm Durumlar</option>
          <option value="pending">Beklemede</option>
          <option value="in-progress">Devam Ediyor</option>
          <option value="completed">Tamamlandı</option>
        </select>
        <select className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Tüm Türler</option>
          <option value="interior">İç Mekan</option>
          <option value="exterior">Dış Mekan</option>
          <option value="commercial">Ticari</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={jobs}
      />
    </div>
  );
}