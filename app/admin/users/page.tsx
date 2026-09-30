'use server';

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

export default async function UsersPage() {
  const users = await fetchUsers();

  const handleDeleteUser = async (id: string) => {
    'use server';
    await deleteUser(id);
  };

  const columns = [
    {
      header: 'Name',
      accessor: 'name' as const,
    },
    {
      header: 'Email',
      accessor: 'email' as const,
    },
    {
      header: 'Role',
      accessor: 'role' as const,
      cell: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      cell: (value: string) => (
        <Badge
          variant={value === 'active' ? 'default' : 'secondary'}
          className={value === 'active' ? 'bg-green-100 text-green-800' : ''}
        >
          {value === 'active' ? '✓ Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Join Date',
      accessor: 'join_date' as const,
      cell: (value: string) => {
        if (!value) return 'N/A';
        return new Date(value).toLocaleDateString();
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-600 mt-1">Manage your team members</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} />
          Add User
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="search"
            placeholder="Search by name or email..."
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="painter">Painter</option>
          <option value="manager">Project Manager</option>
          <option value="coordinator">Coordinator</option>
          <option value="inspector">Quality Inspector</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={users.map((user) => ({
          ...user,
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status as 'active' | 'inactive',
          join_date: user.join_date || user.created_at || '',
        }))}
      />
    </div>
  );
}
