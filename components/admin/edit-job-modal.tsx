'use client';

import { useState, useEffect } from 'react';
import { updateJob, Job } from '@/lib/supabase/queries';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';

interface EditJobModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedJob: Job) => void;
}

export function EditJobModal({ job, isOpen, onClose, onSuccess }: EditJobModalProps) {
  const [formData, setFormData] = useState({
    title: job.title || '',
    customer: job.customer || '',
    type: job.type || 'interior',
    status: job.status || 'pending',
    progress: job.progress || 0,
    budget: job.budget || 0,
    start_date: job.start_date || '',
    due_date: job.due_date || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      title: job.title || '',
      customer: job.customer || '',
      type: job.type || 'interior',
      status: job.status || 'pending',
      progress: job.progress || 0,
      budget: job.budget || 0,
      start_date: job.start_date || '',
      due_date: job.due_date || '',
    });
  }, [job]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updated = await updateJob(job.id, {
        title: formData.title,
        customer: formData.customer,
        type: formData.type,
        status: formData.status as 'pending' | 'in-progress' | 'completed',
        progress: Number(formData.progress),
        budget: Number(formData.budget),
        start_date: formData.start_date,
        due_date: formData.due_date,
      });

      if (updated) {
        onSuccess(updated as Job);
        onClose();
      } else {
        setError('Failed to update job.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while updating.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Edit Job</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Job Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Customer</label>
              <input
                type="text"
                required
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900"
              >
                <option value="interior">Interior</option>
                <option value="exterior">Exterior</option>
                <option value="commercial">Commercial</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Budget (₺)</label>
              <input
                type="number"
                min="0"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-xs font-medium text-slate-700">Progress</label>
              <span className="text-xs text-slate-500">%{formData.progress}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="border-slate-200 text-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}