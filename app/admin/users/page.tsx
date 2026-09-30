'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { fetchUsers } from '@/lib/supabase/queries';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  join_date: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetchUsers();
        setUsers(data.map((user) => ({
          ...user,
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status as 'active' | 'inactive',
          join_date: user.join_date || user.created_at || '',
        })));
      } catch (error) {
        console.error('Kullanıcılar yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const columns = [
    {
      header: 'Ad Soyad',
      accessor: 'name' as const,
      cell: (value: string) => (
        <span className="font-medium text-slate-900">{value}</span>
      ),
    },
    {
      header: 'E-posta',
      accessor: 'email' as const,
      cell: (value: string) => (
        <span className="text-slate-600">{value}</span>
      ),
    },
    {
      header: 'Rol',
      accessor: 'role' as const,
      cell: (value: string) => (
        <Badge variant="outline" className="border-slate-200 text-slate-700 bg-slate-50 font-medium">
          {value}
        </Badge>
      ),
    },
    {
      header: 'Durum',
      accessor: 'status' as const,
      cell: (value: string) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            value === 'active'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-slate-200 bg-slate-100 text-slate-600'
          }`}
        >
          {value === 'active' ? '✓ Aktif' : 'Pasif'}
        </span>
      ),
    },
    {
      header: 'Katılım Tarihi',
      accessor: 'join_date' as const,
      cell: (value: string) => {
        if (!value) return <span className="text-slate-400">Bilinmiyor</span>;
        return (
          <span className="text-slate-600">
            {new Date(value).toLocaleDateString('tr-TR')}
          </span>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500 text-sm font-medium">Kullanıcılar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kullanıcılar</h1>
          <p className="text-slate-500 text-sm mt-0.5">Ekip üyelerinizi yönetin</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
          <Plus size={18} />
          Kullanıcı Ekle
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="search"
            placeholder="İsim veya e-posta ile ara..."
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200/80 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
          />
        </div>
        <select className="px-3.5 py-2 text-sm bg-white border border-slate-200/80 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm">
          <option value="">Tüm Roller</option>
          <option value="admin">Yönetici</option>
          <option value="painter">Boya Ustası</option>
          <option value="manager">Proje Yöneticisi</option>
          <option value="coordinator">Koordinatör</option>
          <option value="inspector">Kalite Kontrolör</option>
        </select>
      </div>

      <DataTable columns={columns} data={users} />
    </div>
  );
}