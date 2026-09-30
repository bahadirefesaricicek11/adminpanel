'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createJob } from '@/lib/supabase/queries';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newJob: any) => void;
}

export function AddJobModal({ isOpen, onClose, onSuccess }: AddJobModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    customer: '',
    type: 'İç Mekan',
    budget: '',
    start_date: '',
    due_date: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const createdJob = await createJob({
        ...formData,
        budget: Number(formData.budget) || 0,
        status: 'pending',
        progress: 0,
      });

      onSuccess(createdJob);
      setFormData({
        title: '',
        customer: '',
        type: 'İç Mekan',
        budget: '',
        start_date: '',
        due_date: '',
      });
      onClose();
    } catch (err: any) {
      console.error('İş eklenirken hata:', err);
      setError('İş kaydedilirken bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Yeni İş Ekle</h2>
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
            <Label className="text-xs font-medium text-slate-700">İş Başlığı</Label>
            <Input
              required
              disabled={loading}
              placeholder="Örn. Villa İç Cephe Boyama"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 border-slate-200/80 bg-white"
            />
          </div>

          <div>
            <Label className="text-xs font-medium text-slate-700">Müşteri Adı</Label>
            <Input
              required
              disabled={loading}
              placeholder="Örn. Ahmet Yılmaz"
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              className="mt-1 border-slate-200/80 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium text-slate-700">İş Türü</Label>
              <select
                disabled={loading}
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-sm bg-white border border-slate-200/80 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50"
              >
                <option value="İç Mekan">İç Mekan</option>
                <option value="Dış Mekan">Dış Mekan</option>
                <option value="Ticari">Ticari</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-medium text-slate-700">Bütçe (₺)</Label>
              <Input
                type="number"
                disabled={loading}
                placeholder="25000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="mt-1 border-slate-200/80 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium text-slate-700">Başlangıç Tarihi</Label>
              <Input
                type="date"
                disabled={loading}
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="mt-1 border-slate-200/80 bg-white"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-slate-700">Bitiş Tarihi</Label>
              <Input
                type="date"
                disabled={loading}
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="mt-1 border-slate-200/80 bg-white"
              />
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
              {loading ? 'Kaydediliyor...' : 'İş Oluştur'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}