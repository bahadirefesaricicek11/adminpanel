'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Ayarlar</h1>
        <p className="text-slate-500 text-sm mt-0.5">Yönetim paneli ayarlarınızı yönetin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Settings */}
          <Card className="p-6 rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Şirket Bilgileri</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-slate-600">Şirket Adı</Label>
                <Input defaultValue="PaintCo" className="mt-1 border-slate-200/80 bg-white text-slate-900" />
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-600">E-posta Adresi</Label>
                <Input defaultValue="admin@paintco.com" type="email" className="mt-1 border-slate-200/80 bg-white text-slate-900" />
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-600">Telefon Numarası</Label>
                <Input defaultValue="+90 (555) 123-4567" className="mt-1 border-slate-200/80 bg-white text-slate-900" />
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-600">Web Sitesi</Label>
                <Input defaultValue="www.paintco.com" className="mt-1 border-slate-200/80 bg-white text-slate-900" />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
                Değişiklikleri Kaydet
              </Button>
            </div>
          </Card>

          {/* Email Notifications */}
          <Card className="p-6 rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">E-posta Bildirimleri</h2>
            <div className="space-y-3.5">
              <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-700">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span>Yeni iş bildirimleri</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-700">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span>İş tamamlama uyarıları</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-700">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span>Ekip aktivite güncellemeleri</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-700">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span>Haftalık raporlar</span>
              </label>
              <div className="pt-2">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
                  Tercihleri Kaydet
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Account Settings */}
          <Card className="p-6 rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Hesap</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                  Y
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Yönetici</p>
                  <p className="text-xs text-slate-500">Sistem Sahibi</p>
                </div>
              </div>
              <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50">
                Şifreyi Değiştir
              </Button>
              <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50">
                İki Faktörlü Doğrulama
              </Button>
            </div>
          </Card>

          {/* System Info */}
          <Card className="p-6 rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Sistem</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Panel Sürümü</span>
                <span className="font-semibold text-slate-900">1.0.0</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="text-slate-500">Veritabanı</span>
                <span className="font-semibold text-slate-900">Supabase</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="text-slate-500">Son Yedekleme</span>
                <span className="font-semibold text-slate-900">Bugün 10:30</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}