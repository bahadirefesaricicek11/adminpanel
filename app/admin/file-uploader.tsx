'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploaderProps {
  jobId: string;
  onUploadComplete?: (url: string) => void;
}

export function FileUploader({ jobId, onUploadComplete }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `jobs/${jobId}/${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage.from('project-files').upload(filePath, file);
      if (error) throw error;

      const { data } = supabase.storage.from('project-files').getPublicUrl(filePath);

      toast.success('Dosya başarıyla yüklendi');
      if (onUploadComplete) onUploadComplete(data.publicUrl);
    } catch (error) {
      toast.error('Dosya yüklenirken bir hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center bg-slate-50/50">
      <input
        type="file"
        id={`file-input-${jobId}`}
        onChange={handleFileUpload}
        disabled={uploading}
        className="hidden"
      />
      <label htmlFor={`file-input-${jobId}`} className="cursor-pointer flex flex-col items-center justify-center gap-2">
        {uploading ? (
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        ) : (
          <Upload className="w-5 h-5 text-slate-400" />
        )}
        <span className="text-xs font-medium text-slate-600">
          {uploading ? 'Dosya yükleniyor...' : 'Sözleşme veya proje fotoğrafı yükleyin'}
        </span>
      </label>
    </div>
  );
}