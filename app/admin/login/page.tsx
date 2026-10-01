'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { AlertCircle, Lock } from 'lucide-react';
import { translations } from '@/lib/translations';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const supabase = createClient();

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (data.session && !error) {
          // Already logged in, redirect to dashboard
          router.push('/admin/dashboard');
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Supabase Auth ile giriş isteği
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(translations.login.invalidCredentials);
        setIsLoading(false);
        return;
      }

      if (data.session) {
        // Hard redirect to clear cache and state
        window.location.href = '/admin/dashboard';
      }
    } catch (err) {
      setError(translations.login.error);
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border border-slate-200 shadow-lg bg-white">
          <div className="p-8">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center animate-pulse">
                <Lock className="text-blue-700" size={24} />
              </div>
            </div>
            <p className="text-center text-slate-600 mt-4">{translations.login.loading}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-slate-200 shadow-lg bg-white">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Lock className="text-blue-700" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{translations.login.title}</h1>
            <p className="text-slate-600 mt-2 text-sm">{translations.login.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-slate-700 font-medium">{translations.login.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder={translations.login.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-700 font-medium">{translations.login.password}</Label>
              <Input
                id="password"
                type="password"
                placeholder={translations.login.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? translations.login.loading : translations.login.signIn}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-600 mb-3 font-semibold">Demo Kimlik Bilgileri:</p>
            <div className="space-y-1 text-xs text-slate-700 bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <p><span className="font-semibold">E-posta:</span> bahadirefesaricicek11@gmail.com</p>
              <p><span className="font-semibold">Şifre:</span> adminpaneltestcode123</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}