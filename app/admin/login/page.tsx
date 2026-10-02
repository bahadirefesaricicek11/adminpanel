'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Brush, CheckCircle2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { logActivity, logActivityError, logSessionStart } from '@/lib/utils/activity-logger';

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => { supabase.auth.getSession().then(({ data, error: sessionError }) => { if (data.session && !sessionError) router.replace('/admin/dashboard'); else setIsCheckingAuth(false); }).catch(() => setIsCheckingAuth(false)); }, [router, supabase]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setIsLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) { await logActivityError({ action: 'login', resourceType: 'auth' }, authError); setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.'); return; }
      if (data.session && data.user) { await logActivity({ action: 'login', resourceType: 'auth', resourceName: data.user.email }); await logSessionStart(data.user.id, data.user.email || ''); router.replace('/admin/dashboard'); }
    } catch (caughtError) { const authError = caughtError instanceof Error ? caughtError : new Error('Giriş başarısız'); await logActivityError({ action: 'login', resourceType: 'auth' }, authError); setError('Giriş sırasında bir sorun oluştu. Lütfen tekrar deneyin.'); } finally { setIsLoading(false); }
  };

  if (isCheckingAuth) return <div className="flex min-h-screen items-center justify-center bg-[#edf1eb] text-sm text-[#12242a]/50">Güvenli giriş hazırlanıyor...</div>;

  return <main className="grid min-h-screen bg-[#edf1eb] lg:grid-cols-[0.85fr_1.15fr]">
    <section className="hidden bg-[#12242a] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-16"><Link href="/" className="flex items-center gap-3 font-semibold"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d9ff4f] text-[#12242a]"><Brush size={18} /></span>PaintCo<span className="text-[#d9ff4f]">.</span></Link><div className="max-w-md"><p className="text-sm uppercase tracking-[0.2em] text-white/40">Yönetici alanı</p><h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-[-0.06em]">Operasyonun kontrolü sizde.</h1><p className="mt-6 leading-7 text-white/60">İçerik, ekip ve performans verilerinizi güvenli bir çalışma alanında yönetin.</p><div className="mt-10 space-y-4 text-sm text-white/70"><p className="flex items-center gap-3"><CheckCircle2 size={17} className="text-[#d9ff4f]" /> Davet tabanlı erişim</p><p className="flex items-center gap-3"><CheckCircle2 size={17} className="text-[#d9ff4f]" /> Canlı yönetim metrikleri</p><p className="flex items-center gap-3"><CheckCircle2 size={17} className="text-[#d9ff4f]" /> Güvenli oturum takibi</p></div></div><p className="text-xs text-white/35">© 2026 PaintCo · Sadece yetkili yöneticiler</p></section>
    <section className="flex items-center justify-center px-6 py-12 sm:px-10"><div className="w-full max-w-md"><Link href="/" className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-[#12242a]/55 transition hover:text-[#12242a] lg:hidden"><ArrowLeft size={16} /> Ana sayfaya dön</Link><div className="mb-10"><div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9ff4f] text-[#12242a]"><LockKeyhole size={22} /></div><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#4e8790]">Yetkili erişim</p><h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#12242a]">Kontrol odasına giriş</h2><p className="mt-4 leading-7 text-[#12242a]/55">PaintCo yöneticisiyseniz hesabınızla devam edin. Yeni hesap oluşturma kapalıdır.</p></div><form onSubmit={handleSubmit} className="space-y-5"><label className="block"><span className="text-sm font-semibold text-[#12242a]">E-posta adresi</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="yönetici@şirketiniz.com" required disabled={isLoading} className="mt-2 h-12 w-full rounded-xl border border-[#12242a]/15 bg-[#f8faf5] px-4 text-sm outline-none transition placeholder:text-[#12242a]/30 focus:border-[#4e8790] focus:ring-4 focus:ring-[#4e8790]/10" /></label><label className="block"><span className="text-sm font-semibold text-[#12242a]">Şifre</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Şifrenizi girin" required disabled={isLoading} className="mt-2 h-12 w-full rounded-xl border border-[#12242a]/15 bg-[#f8faf5] px-4 text-sm outline-none transition placeholder:text-[#12242a]/30 focus:border-[#4e8790] focus:ring-4 focus:ring-[#4e8790]/10" /></label>{error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<button type="submit" disabled={isLoading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#12242a] font-bold text-[#d9ff4f] transition hover:bg-[#2b474f] disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? 'Giriş yapılıyor...' : <>Güvenli giriş <ArrowUpRight size={17} /></>}</button></form><div className="mt-8 flex items-start gap-3 border-t border-[#12242a]/10 pt-6 text-xs leading-5 text-[#12242a]/45"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#4e8790]" /><span>Bu alan yalnızca PaintCo yöneticileri içindir. Erişim sorunu yaşıyorsanız mevcut yöneticinizle iletişime geçin.</span></div></div></section>
  </main>;
}
