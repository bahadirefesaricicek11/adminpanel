import Link from "next/link";
import { Brush, BarChart3, Users, Zap, ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Gezinme Çubuğu */}
      <nav className="border-b border-blue-200 backdrop-blur-md sticky top-0 z-50 bg-white/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Brush className="text-blue-700" size={28} />
            <span>Site Yönetimi</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/login"
              className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              Kontrol Paneli <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Ana Tanıtım Bölümü (Hero) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900">
            Profesyonel Boya <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-600">Yönetim Sistemi</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Boya ve dekorasyon işlerinizi yönetmek için kapsamlı yönetim paneli. Projeleri takip edin, ekipleri yönetin ve anlık verilerle işinizi büyütün.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link
              href="/admin"
              className="px-8 py-3 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              Yönetim Paneline Git <ArrowRight size={18} />
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 rounded-lg border border-blue-700 text-blue-700 hover:bg-blue-50 transition-colors"
            >
              Daha Fazla Bilgi
            </Link>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-3 gap-4 mt-20">
          <div className="bg-white border border-blue-200 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-blue-700">48</div>
            <div className="text-slate-600 mt-2">Aktif Ekip Üyesi</div>
          </div>
          <div className="bg-white border border-blue-200 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-blue-700">243</div>
            <div className="text-slate-600 mt-2">Tamamlanan Proje</div>
          </div>
          <div className="bg-white border border-blue-200 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-blue-700">₺156.5k</div>
            <div className="text-slate-600 mt-2">Toplam Ciro</div>
          </div>
        </div>
      </section>

      {/* Özellikler Bölümü */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">
          Özellikler
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Özellik 1 */}
          <div className="bg-white border border-blue-200 rounded-lg p-8 hover:border-blue-400 transition-all hover:shadow-md">
            <BarChart3 className="text-blue-700 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Panel Analizleri</h3>
            <p className="text-slate-600">
              İş performansınız, gelir takibiniz ve proje metrikleriniz hakkında gerçek zamanlı grafikler.
            </p>
          </div>

          {/* Özellik 2 */}
          <div className="bg-white border border-blue-200 rounded-lg p-8 hover:border-blue-400 transition-all hover:shadow-md">
            <Users className="text-blue-700 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Ekip Yönetimi</h3>
            <p className="text-slate-600">
              Boyacıları, koordinatörleri ve denetçileri yönetin. Ekip üyelerinin durumunu ve rollerini takip edin.
            </p>
          </div>

          {/* Özellik 3 */}
          <div className="bg-white border border-blue-200 rounded-lg p-8 hover:border-blue-400 transition-all hover:shadow-md">
            <Brush className="text-blue-700 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">İş Takibi</h3>
            <p className="text-slate-600">
              Tüm boya projelerini teklif aşamasından teslimata kadar ilerleme durumuyla düzenleyin ve izleyin.
            </p>
          </div>

          {/* Özellik 4 */}
          <div className="bg-white border border-blue-200 rounded-lg p-8 hover:border-blue-400 transition-all hover:shadow-md">
            <Zap className="text-blue-700 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Gerçek Zamanlı Veri</h3>
            <p className="text-slate-600">
              Tüm operasyonlarda anında güncelleme için Supabase ile canlı veritabanı entegrasyonu.
            </p>
          </div>

          {/* Özellik 5 */}
          <div className="bg-white border border-blue-200 rounded-lg p-8 hover:border-blue-400 transition-all hover:shadow-md">
            <CheckCircle className="text-blue-700 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Proje Yönetimi</h3>
            <p className="text-slate-600">
              Farklı proje türlerini (İç Mekan, Dış Cephe, Ticari) bütçe ve zaman çizelgesi yönetimi ile takip edin.
            </p>
          </div>

          {/* Özellik 6 */}
          <div className="bg-white border border-blue-200 rounded-lg p-8 hover:border-blue-400 transition-all hover:shadow-md">
            <BarChart3 className="text-blue-700 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Analiz ve Raporlama</h3>
            <p className="text-slate-600">
              Etkileşimli grafikler ve veri görselleştirme ile eğilimleri, geliri ve performans metriklerini görün.
            </p>
          </div>
        </div>
      </section>

      {/* Harekete Geçirme Bölümü (CTA) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-300 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Boya işinizi yönetmeye hazır mısınız?
          </h2>
          <p className="text-slate-600 mb-8">
            İşleri takip etmeye, ekibinizi yönetmeye ve işinizi büyütmeye başlamak için yönetim paneline erişin.
          </p>
          <Link
            href="/admin/login"
            className="inline-block px-8 py-4 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-colors"
          >
            Panele Giriş Yap
          </Link>
        </div>
      </section>

      {/* Alt Bilgi (Footer) */}
      <footer className="border-t border-blue-200 bg-slate-50 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-600">
          <p>
            PaintCo Yönetim Paneli • <span className="text-blue-700 font-semibold">Next.js</span> ve <span className="text-blue-700 font-semibold">Supabase</span> ile geliştirildi
          </p>
          <p className="mt-2 text-sm">© 2026 PaintCo. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </main>
  );
}