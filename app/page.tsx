import Link from "next/link";
import { ArrowUpRight, BarChart3, Brush, Check, Layers3, ShieldCheck, Sparkles, Users } from "lucide-react";

const features = [
  { icon: BarChart3, title: "Net görünürlük", text: "Gelir, proje durumu ve ekip performansını tek bakışta takip edin." },
  { icon: Layers3, title: "Düzenli operasyon", text: "İçeriği, ayarları ve günlük işleri dağınık araçlar olmadan yönetin." },
  { icon: Users, title: "Küçük ekipler için", text: "Bir veya iki yöneticiyle güvenli, sade ve hızlı bir çalışma alanı." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f5f1] text-[#172126]">
      <nav className="sticky top-0 z-20 border-b border-[#172126]/10 bg-[#f6f5f1]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e56b4f] text-white shadow-sm"><Brush size={18} /></span>
            <span className="text-lg">PaintCo<span className="text-[#e56b4f]">.</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-[#172126]/50 sm:inline">Yönetim alanı</span>
            <Link href="/admin/login" className="inline-flex items-center gap-2 rounded-full bg-[#172126] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2b3b41]">Giriş yap <ArrowUpRight size={15} /></Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden border-b border-[#172126]/10 bg-[#172126] text-white">
        <div className="absolute inset-y-0 right-0 w-1/3 border-l border-white/10 bg-[#e56b4f]/10" />
        <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-[1.25fr_0.75fr] lg:px-10 lg:py-32">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white/70"><Sparkles size={14} className="text-[#f3a08d]" /> PaintCo yönetim sistemi</div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl">İşinizin ritmini <span className="text-[#f3a08d]">tek yerde</span> görün.</h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-white/65">Boya ve dekorasyon operasyonunuzu daha sakin, daha ölçülebilir ve daha kontrollü yönetmek için tasarlanmış çalışma alanı.</p>
            <div className="mt-10 flex flex-wrap items-center gap-4"><Link href="/admin/login" className="inline-flex items-center gap-2 rounded-full bg-[#e56b4f] px-6 py-3.5 font-semibold text-white transition hover:bg-[#f07d61]">Yönetim paneline gir <ArrowUpRight size={17} /></Link><a href="#ozellikler" className="rounded-full border border-white/20 px-6 py-3.5 font-medium text-white/80 transition hover:border-white/40 hover:text-white">Nasıl çalışır?</a></div>
          </div>
          <div className="flex items-end"><div className="w-full border-l-2 border-[#e56b4f] pl-6"><p className="text-sm uppercase tracking-[0.18em] text-white/45">Bugünün odağı</p><p className="mt-4 text-3xl font-semibold leading-tight">Daha az dağınıklık.<br />Daha iyi kararlar.</p><div className="mt-8 grid grid-cols-2 gap-3">{["Canlı metrikler", "İçerik kontrolü", "Ekip görünümü", "Güvenli erişim"].map((item) => <div key={item} className="border-t border-white/15 pt-3 text-sm text-white/65"><Check size={15} className="mb-2 text-[#f3a08d]" />{item}</div>)}</div></div></div>
        </div>
      </section>

      <section id="ozellikler" className="mx-auto max-w-7xl px-6 py-24 lg:px-10"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e56b4f]">Araç seti</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Operasyonu sadeleştiren bir merkez.</h2></div><div className="mt-14 grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <article key={title} className="border-t-2 border-[#172126] pt-6"><Icon size={22} className="text-[#e56b4f]" /><h3 className="mt-8 text-xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-[#172126]/60">{text}</p></article>)}</div></section>

      <section className="mx-6 mb-10 overflow-hidden rounded-[2rem] bg-[#e9ded3] lg:mx-auto lg:max-w-7xl"><div className="grid gap-10 px-8 py-12 sm:px-14 sm:py-16 md:grid-cols-[1fr_auto] md:items-end"><div><ShieldCheck className="text-[#e56b4f]" size={26} /><h2 className="mt-5 max-w-xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Yalnızca yetkili yöneticiler için.</h2><p className="mt-4 max-w-lg leading-7 text-[#172126]/65">PaintCo yönetim alanı davet tabanlıdır. Hesap oluşturma yoktur; erişim yalnızca sizin belirlediğiniz yöneticiler içindir.</p></div><Link href="/admin/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#172126] px-6 py-3.5 font-semibold text-white transition hover:bg-[#2b3b41]">Güvenli giriş <ArrowUpRight size={17} /></Link></div></section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-[#172126]/50 sm:flex-row sm:items-center sm:justify-between lg:px-10"><span>© 2026 PaintCo</span><span>Next.js · Supabase · Güvenli yönetim</span></footer>
    </main>
  );
}
