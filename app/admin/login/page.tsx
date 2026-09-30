'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Supabase Auth ile gerçek giriş isteği
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('Geçersiz e-posta veya şifre. Lütfen bilgilerinizi kontrol edin.');
        setIsLoading(false);
        return;
      }

      if (data.session) {
        // Sert yönlendirme ile önbellek ve state karmaşasını engelle
        window.location.href = '/admin/dashboard';
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-slate-200/80 shadow-sm bg-white">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">PaintCo Admin</h1>
            <p className="text-slate-500 mt-2 text-sm">Yönetim Paneli Girişi</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-slate-700">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-slate-200"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-700">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="Şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 border-slate-200"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex gap-2">
                <AlertCircle className="text-rose-600 flex-shrink-0" size={18} />
                <p className="text-sm text-rose-800">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-2 font-medium">Demo Kimlik Bilgileri:</p>
            <div className="space-y-1 text-xs text-slate-600 bg-slate-50 border border-slate-200/60 p-3 rounded-lg">
              <p><span className="font-semibold text-slate-700">E-posta:</span> bahadirefesaricicek11@gmail.com</p>
              <p><span className="font-semibold text-slate-700">Şifre:</span> adminpaneltestcode123</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}