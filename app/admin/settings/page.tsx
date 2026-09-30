'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Ayarlar</h1>
        <p className="text-slate-600 mt-1">Yönetim paneli ayarlarınızı yönetin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Şirket Bilgileri</h2>
            <div className="space-y-4">
              <div>
                <Label>Şirket Adı</Label>
                <Input defaultValue="PaintCo" className="mt-1" />
              </div>
              <div>
                <Label>E-posta Adresi</Label>
                <Input defaultValue="admin@paintco.com" type="email" className="mt-1" />
              </div>
              <div>
                <Label>Telefon Numarası</Label>
                <Input defaultValue="+90 (555) 123-4567" className="mt-1" />
              </div>
              <div>
                <Label>Web Sitesi</Label>
                <Input defaultValue="www.paintco.com" className="mt-1" />
              </div>
              <Button>Değişiklikleri Kaydet</Button>
            </div>
          </Card>

          {/* Email Notifications */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">E-posta Bildirimleri</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span>Yeni iş bildirimleri</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span>İş tamamlama uyarıları</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span>Ekip aktivite güncellemeleri</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span>Haftalık raporlar</span>
              </label>
              <Button>Tercihleri Kaydet</Button>
            </div>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Account Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Hesap</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  Y
                </div>
                <div>
                  <p className="font-semibold">Yönetici</p>
                  <p className="text-sm text-slate-500">Sistem Sahibi</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Şifreyi Değiştir
              </Button>
              <Button variant="outline" className="w-full">
                İki Faktörlü Doğrulama
              </Button>
            </div>
          </Card>

          {/* System Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Sistem</h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-slate-600">Panel Sürümü</p>
                <p className="font-semibold">1.0.0</p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-slate-600">Veritabanı</p>
                <p className="font-semibold">Supabase</p>
              </div>
              <div className="pt-2 border-t pb-2">
                <p className="text-slate-600">Son Yedekleme</p>
                <p className="font-semibold">Bugün 10:30</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}