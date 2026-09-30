'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Plus, UserCheck } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalSpent: number;
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '+90 532 111 2233',
    address: 'Kadıköy, İstanbul',
    totalSpent: 45000,
  },
  {
    id: '2',
    name: 'Mehmet Demir',
    email: 'mehmet@example.com',
    phone: '+90 533 444 5566',
    address: 'Beşiktaş, İstanbul',
    totalSpent: 120000,
  },
];

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(mockCustomers);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Müşteriler</h1>
          <p className="text-sm text-slate-500">Müşteri kayıtları ve iletişim bilgilerini yönetin</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium">
          <Plus size={16} /> Müşteri Ekle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((c) => (
          <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">{c.name}</h3>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
                <UserCheck size={12} className="mr-1" /> Aktif
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-slate-400" />
                <span>{c.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-slate-400" />
                <span>{c.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-slate-400" />
                <span>{c.address}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium uppercase tracking-wider">Toplam Harcama</span>
              <span className="font-bold text-slate-900 text-sm">₺{c.totalSpent.toLocaleString('tr-TR')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}