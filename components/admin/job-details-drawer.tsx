'use client';

import { X, Calendar, DollarSign, User, Tag, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

interface JobDetailsDrawerProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobDetailsDrawer({ job, isOpen, onClose }: JobDetailsDrawerProps) {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Job Details</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 rounded-lg p-1">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Title</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{job.title}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <User size={14} /> Customer
                </div>
                <p className="text-sm font-semibold text-slate-800">{job.customer}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Tag size={14} /> Type
                </div>
                <Badge variant="outline" className="text-xs font-medium bg-slate-50">
                  {job.type}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><Activity size={14} /> Progress</span>
                <span className="font-bold text-slate-800">%{job.progress}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${job.progress}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <DollarSign size={14} /> Budget
                </div>
                <p className="text-base font-bold text-slate-900">₺{job.budget?.toLocaleString('tr-TR')}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Calendar size={14} /> Due Date
                </div>
                <p className="text-sm font-semibold text-slate-800">{job.due_date || 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <Button variant="outline" onClick={onClose} className="text-slate-700">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}