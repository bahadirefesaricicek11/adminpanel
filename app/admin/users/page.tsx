'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Plus,
  UserCheck,
  UserX,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Edit,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'yonetici' | 'proje_yoneticisi' | 'saha_calisani';
  status: 'aktif' | 'pasif';
  createdAt: string;
}

const mockUsers: UserItem[] = [
  {
    id: '1',
    name: 'Bahadır Sarıçiçek',
    email: 'bahadir@example.com',
    phone: '+90 532 000 0001',
    role: 'yonetici',
    status: 'aktif',
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '+90 532 000 0002',
    role: 'proje_yoneticisi',
    status: 'aktif',
    createdAt: '2026-03-10',
  },
  {
    id: '3',
    name: 'Mehmet Demir',
    email: 'mehmet@example.com',
    phone: '+90 532 000 0003',
    role: 'saha_calisani',
    status: 'aktif',
    createdAt: '2026-05-22',
  },
  {
    id: '4',
    name: 'Ayşe Kaya',
    email: 'ayse@example.com',
    phone: '+90 532 000 0004',
    role: 'saha_calisani',
    status: 'pasif',
    createdAt: '2026-06-01',
  },
];

const roleConfig = {
  yonetici: {
    label: 'Yönetici',
    className: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: ShieldAlert,
  },
  proje_yoneticisi: {
    label: 'Proje Yöneticisi',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: ShieldCheck,
  },
  saha_calisani: {
    label: 'Saha Çalışanı',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: User,
  },
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('hepsi');

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone.includes(searchQuery);

      const matchesRole =
        selectedRole === 'hepsi' || u.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRole]);

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'aktif' ? 'pasif' : 'aktif' }
          : u
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kullanıcı Yönetimi</h1>
          <p className="text-sm text-slate-500">Sistem kullanıcılarını, yetkilerini ve erişim durumlarını düzenleyin</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium">
          <Plus size={16} /> Yeni Kullanıcı Ekle
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input
            placeholder="İsim, e-posta veya telefon ile ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-600"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {[
            { key: 'hepsi', label: 'Tümü' },
            { key: 'yonetici', label: 'Yöneticiler' },
            { key: 'proje_yoneticisi', label: 'Proje Yöneticileri' },
            { key: 'saha_calisani', label: 'Saha Çalışanları' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedRole(tab.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedRole === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Kullanıcı</th>
                <th className="px-6 py-3.5">İletişim</th>
                <th className="px-6 py-3.5">Rol</th>
                <th className="px-6 py-3.5">Durum</th>
                <th className="px-6 py-3.5">Kayıt Tarihi</th>
                <th className="px-6 py-3.5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((user) => {
                const roleInfo = roleConfig[user.role];
                const RoleIcon = roleInfo.icon;

                return (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* User Name & Avatar */}
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs uppercase">
                          {user.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-xs text-slate-400 font-normal">ID: #{user.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail size={12} className="text-slate-400" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone size={12} className="text-slate-400" />
                        <span>{user.phone}</span>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={`font-medium gap-1 px-2.5 py-0.5 ${roleInfo.className}`}
                      >
                        <RoleIcon size={12} />
                        {roleInfo.label}
                      </Badge>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      {user.status === 'aktif' ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium gap-1">
                          <UserCheck size={12} /> Aktif
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200 font-medium gap-1">
                          <UserX size={12} /> Pasif
                        </Badge>
                      )}
                    </td>

                    {/* Registered Date */}
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                      {user.createdAt}
                    </td>

                    {/* Action Menu */}
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Kullanıcı Seçenekleri</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Edit size={14} /> Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleUserStatus(user.id)}
                            className="gap-2 cursor-pointer"
                          >
                            {user.status === 'aktif' ? (
                              <>
                                <UserX size={14} className="text-amber-600" /> Pasife Al
                              </>
                            ) : (
                              <>
                                <UserCheck size={14} className="text-emerald-600" /> Aktifleştir
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-rose-600 focus:text-rose-600 cursor-pointer">
                            <Trash2 size={14} /> Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                    Arama kriterlerinize uygun kullanıcı bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}