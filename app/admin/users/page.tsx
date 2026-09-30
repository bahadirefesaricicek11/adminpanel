'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/data-table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { fetchUsers, deleteUser } from '@/lib/supabase/queries';

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
    },
    {
      header: 'E-posta',
      accessor: 'email' as const,
    },
    {
      header: 'Rol',
      accessor: 'role' as const,
      cell: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      header: 'Durum',
      accessor: 'status' as const,
      cell: (value: string) => (
        <Badge
          variant={value === 'active' ? 'default' : 'secondary'}
          className={value === 'active' ? 'bg-green-100 text-green-800' : ''}
        >
          {value === 'active' ? '✓ Aktif' : 'Pasif'}
        </Badge>
      ),
    },
    {
      header: 'Katılım Tarihi',
      accessor: 'join_date' as const,
      cell: (value: string) => {
        if (!value) return 'Bilinmiyor';
        return new Date(value).toLocaleDateString('tr-TR');
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-600">Kullanıcılar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Kullanıcılar</h1>
          <p className="text-slate-600 mt-1">Ekip üyelerinizi yönetin</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} />
          Kullanıcı Ekle
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="search"
            placeholder="İsim veya e-posta ile ara..."
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Tüm Roller</option>
          <option value="admin">Yönetici</option>
          <option value="painter">Boya Ustası</option>
          <option value="manager">Proje Yöneticisi</option>
          <option value="coordinator">Koordinatör</option>
          <option value="inspector">Kalite Kontrolör</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={users}
      />
    </div>
  );
}