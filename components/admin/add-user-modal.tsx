'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createUser } from '@/lib/supabase/queries';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newUser: any) => void;
}

export function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Boya Ustası',
    status: 'active' as 'active' | 'inactive',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Pass formData directly to match the User table schema expected by Supabase queries
      const createdUser = await createUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      });

      onSuccess(createdUser);
      setFormData({
        name: '',
        email: '',
        role: 'Boya Ustası',
        status: 'active',
      });
      onClose();
    } catch (err: any) {
      console.error('Kullanıcı eklenirken hata:', err);
      setError('Kullanıcı kaydedilirken bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Kullanıcı Ekle</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <Label className="text-xs font-medium text-slate-700">Ad Soyad</Label>
            <Input
              required
              disabled={loading}
              placeholder="Örn. Mehmet Demir"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 border-slate-200/80 bg-white"
            />
          </div>

          <div>
            <Label className="text-xs font-medium text-slate-700">E-posta Adresi</Label>
            <Input
              required
              type="email"
              disabled={loading}
              placeholder="mehmet@paintco.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 border-slate-200/80 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium text-slate-700">Rol</Label>
              <select
                disabled={loading}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-sm bg-white border border-slate-200/80 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50"
              >
                <option value="Yönetici">Yönetici</option>
                <option value="Proje Yöneticisi">Proje Yöneticisi</option>
                <option value="Boya Ustası">Boya Ustası</option>
                <option value="Koordinatör">Koordinatör</option>
                <option value="Kalite Kontrolör">Kalite Kontrolör</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-medium text-slate-700">Durum</Label>
              <select
                disabled={loading}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full mt-1 px-3 py-2 text-sm bg-white border border-slate-200/80 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={onClose}
              className="border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Kaydediliyor...' : 'Kullanıcıyı Kaydet'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}