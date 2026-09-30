'use client';

import { useState } from 'react';
import { DataTable } from '@/components/admin/data-table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Rodriguez',
    email: 'john@paintco.com',
    role: 'Painter',
    status: 'active',
    joinDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@paintco.com',
    role: 'Project Manager',
    status: 'active',
    joinDate: '2024-02-20',
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@paintco.com',
    role: 'Painter',
    status: 'active',
    joinDate: '2024-03-10',
  },
  {
    id: '4',
    name: 'Lisa Anderson',
    email: 'lisa@paintco.com',
    role: 'Admin',
    status: 'active',
    joinDate: '2023-12-01',
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@paintco.com',
    role: 'Painter',
    status: 'inactive',
    joinDate: '2024-01-05',
  },
  {
    id: '6',
    name: 'Emma Wilson',
    email: 'emma@paintco.com',
    role: 'Coordinator',
    status: 'active',
    joinDate: '2024-04-12',
  },
  {
    id: '7',
    name: 'James Taylor',
    email: 'james@paintco.com',
    role: 'Painter',
    status: 'active',
    joinDate: '2024-02-28',
  },
  {
    id: '8',
    name: 'Rachel Lee',
    email: 'rachel@paintco.com',
    role: 'Quality Inspector',
    status: 'active',
    joinDate: '2024-03-22',
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);

  const handleEdit = (user: User) => {
    console.log('Edit user:', user);
    alert(`Edit functionality for ${user.name}`);
  };

  const handleDelete = (user: User) => {
    setUsers(users.filter((u) => u.id !== user.id));
    alert(`User ${user.name} deleted`);
  };

  const handleAddUser = () => {
    alert('Add user functionality');
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
      accessor: 'joinDate' as const,
      cell: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-600 mt-1">Manage your team members</p>
        </div>
        <Button onClick={handleAddUser} className="gap-2">
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
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
