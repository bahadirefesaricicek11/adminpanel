'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, RotateCcw } from 'lucide-react';

interface WebsiteContent {
  homepage: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
  features: {
    title: string;
    items: Array<{ title: string; description: string }>;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

const defaultContent: WebsiteContent = {
  homepage: {
    title: 'Profesyonel Boyama Yönetimi',
    subtitle: 'PaintCo Admin Panel ile resim işinizi yönetin. İşleri takip edin, ekibinizi yönetin ve gerçek zamanlı öğrenmelerle işinizi büyütün.',
    ctaText: 'Admin Paneline Erişin',
  },
  features: {
    title: 'Özellikler',
    items: [
      {
        title: 'Dashboard Analitikleri',
        description: 'İşletkenizin performansı, gelir takibi ve proje metrikleri hakkında gerçek zamanlı öngörüler.',
      },
      {
        title: 'Ekip Yönetimi',
        description: 'Boyacılar, koordinatörler ve denetçileri yönetin. Ekip üyesi durumunu ve rollerini izleyin.',
      },
      {
        title: 'İş Takibi',
        description: 'Tüm boyama projelerini teklif sahibinden tamamlanmaya kadar düzenleyin ve izleyin.',
      },
      {
        title: 'Gerçek Zamanlı Veriler',
        description: 'Tüm operasyonlarda anlık güncellemeler için Supabase ile canlı veritabanı entegrasyonu.',
      },
      {
        title: 'Proje Yönetimi',
        description: 'Bütçe ve zaman çizelgesi yönetimi ile birden fazla proje türünü izleyin.',
      },
      {
        title: 'Analitik & Raporlama',
        description: 'İnteraktif grafikler ve veri görselleştirmesi ile trendleri, geliri ve performans metriklerini görselleştirin.',
      },
    ],
  },
  contact: {
    email: 'admin@paintco.com',
    phone: '+90 (555) 123-4567',
    address: 'İstanbul, Türkiye',
  },
};

export default function ContentManagementPage() {
  const [content, setContent] = useState<WebsiteContent>(defaultContent);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('websiteContent', JSON.stringify(content));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setContent(defaultContent);
  };

  const updateHomepage = (field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      homepage: { ...prev.homepage, [field]: value },
    }));
  };

  const updateContact = (field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const updateFeatureItem = (index: number, field: string, value: string) => {
    const newItems = [...content.features.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent((prev) => ({
      ...prev,
      features: { ...prev.features, items: newItems },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Website İçeriği</h1>
        <p className="text-sm text-slate-600 mt-1">Ana website sayfalarınızın içeriğini yönetin ve düzenleyin</p>
      </div>

      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          ✓ İçerik başarıyla kaydedildi!
        </div>
      )}

      {/* Homepage Section */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Ana Sayfa (Homepage)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="font-medium text-slate-700">Başlık</Label>
            <Input
              value={content.homepage.title}
              onChange={(e) => updateHomepage('title', e.target.value)}
              className="mt-1.5"
              placeholder="Sayfa başlığı..."
            />
          </div>

          <div>
            <Label className="font-medium text-slate-700">Alt Başlık</Label>
            <textarea
              value={content.homepage.subtitle}
              onChange={(e) => updateHomepage('subtitle', e.target.value)}
              className="mt-1.5 w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Sayfa alt başlığı..."
            />
          </div>

          <div>
            <Label className="font-medium text-slate-700">CTA (Harekete Geçme) Düğmesi Metni</Label>
            <Input
              value={content.homepage.ctaText}
              onChange={(e) => updateHomepage('ctaText', e.target.value)}
              className="mt-1.5"
              placeholder="Düğme metni..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Features Section */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Özellikler Bölümü</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="font-medium text-slate-700">Özellikler Başlığı</Label>
            <Input
              value={content.features.title}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  features: { ...prev.features, title: e.target.value },
                }))
              }
              className="mt-1.5"
              placeholder="Özellikler bölümü başlığı..."
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Özellik Kartları</h3>
            {content.features.items.map((item, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <Input
                  value={item.title}
                  onChange={(e) => updateFeatureItem(index, 'title', e.target.value)}
                  placeholder="Özellik başlığı..."
                  className="font-medium"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => updateFeatureItem(index, 'description', e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={3}
                  placeholder="Özellik açıklaması..."
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">İletişim Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="font-medium text-slate-700">E-posta Adresi</Label>
            <Input
              value={content.contact.email}
              onChange={(e) => updateContact('email', e.target.value)}
              className="mt-1.5"
              type="email"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <Label className="font-medium text-slate-700">Telefon Numarası</Label>
            <Input
              value={content.contact.phone}
              onChange={(e) => updateContact('phone', e.target.value)}
              className="mt-1.5"
              placeholder="+90 (555) 123-4567"
            />
          </div>

          <div>
            <Label className="font-medium text-slate-700">Adres</Label>
            <Input
              value={content.contact.address}
              onChange={(e) => updateContact('address', e.target.value)}
              className="mt-1.5"
              placeholder="Şehir, Ülke"
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white">
          <Save size={18} />
          Değişiklikleri Kaydet
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex items-center gap-2 border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <RotateCcw size={18} />
          Varsayılan Ayarları Sıfırla
        </Button>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
        <strong>Not:</strong> Değişiklikler tarayıcınızda saklanır. Veritabanı entegrasyonunu tamamlamak için Supabase tablosu ayarlanması gerekir.
      </div>
    </div>
  );
}
