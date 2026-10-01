'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { AlertCircle, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { translations } from '@/lib/translations';
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthLabel } from '@/lib/utils/password-validator';
import { logActivity, logActivityError, logSessionStart } from '@/lib/utils/activity-logger';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [passwordFeedback, setPasswordFeedback] = useState<any>(null);
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

  // Real-time password validation
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value.length > 0) {
      setPasswordFeedback(validatePassword(value));
    } else {
      setPasswordFeedback(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate email
      if (!email || !email.includes('@')) {
        setError('Lütfen geçerli bir e-posta adresi girin');
        setIsLoading(false);
        return;
      }

      // Validate password
      if (!password || password.length < 6) {
        setError('Lütfen şifrenizi girin');
        setIsLoading(false);
        return;
      }

      // Attempt login
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Log failed login attempt
        await logActivityError(
          { action: 'login', resourceType: 'auth' },
          authError
        );

        // User-friendly error messages
        if (authError.message.includes('Invalid login credentials')) {
          setError('E-posta veya şifre hatalı. Lütfen tekrar kontrol edin.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('E-posta adresiniz doğrulanmamış. Lütfen e-postanızı kontrol edin.');
        } else if (authError.message.includes('User not found')) {
          setError('Bu e-posta adresiyle bir hesap bulunamadı.');
        } else if (authError.message.includes('too_many_requests')) {
          setError('Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.');
        } else {
          setError(`Giriş hatası: ${authError.message}`);
        }
        
        setIsLoading(false);
        return;
      }

      if (data.session && data.user) {
        // Log successful login
        await logActivity({
          action: 'login',
          resourceType: 'auth',
          resourceName: data.user.email,
        });

        // Log session start
        await logSessionStart(data.user.id, data.user.email || '');

        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 500);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Bilinmeyen bir hata oluştu');
      
      // Log the error
      await logActivityError(
        { action: 'login', resourceType: 'auth' },
        error
      );

      setError('Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.');
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
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="mt-1.5 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                disabled={isLoading}
                required
              />
              
              {/* Password Strength Indicator */}
              {passwordFeedback && password.length > 0 && (
                <div className="mt-3 space-y-2">
                  {/* Strength Bar */}
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-colors ${
                          i < Math.ceil(passwordFeedback.score / 25)
                            ? getPasswordStrengthColor(passwordFeedback.strength)
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Strength Label */}
                  <p className="text-xs font-medium text-slate-600">
                    Şifre Gücü:{' '}
                    <span className={`font-bold ${
                      passwordFeedback.strength === 'weak' ? 'text-red-600' :
                      passwordFeedback.strength === 'fair' ? 'text-yellow-600' :
                      passwordFeedback.strength === 'good' ? 'text-blue-600' :
                      'text-green-600'
                    }`}>
                      {getPasswordStrengthLabel(passwordFeedback.strength)}
                    </span>
                  </p>

                  {/* Feedback */}
                  {passwordFeedback.feedback.length > 0 && (
                    <div className="space-y-1">
                      {passwordFeedback.feedback.map((item: string, idx: number) => (
                        <p key={idx} className="text-xs text-amber-700 flex gap-1">
                          <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
                          {item}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Success Indicator */}
                  {passwordFeedback.isValid && (
                    <p className="text-xs text-green-700 flex gap-1">
                      <CheckCircle size={12} className="flex-shrink-0 mt-0.5" />
                      Şifre güçlü ve güvenli
                    </p>
                  )}
                </div>
              )}
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