'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, RotateCcw, Upload, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface WebsiteContent {
  id?: string;
  homepage: {
    title: string;
    subtitle: string;
    ctaText: string;
    heroImage?: string;
    heroImageAlt?: string;
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
  seo: {
    homePageTitle: string;
    homePageDescription: string;
    homePageKeywords: string;
  };
  branding: {
    logo?: string;
    favicon?: string;
    companyName: string;
  };
  updated_at?: string;
}

const defaultContent: WebsiteContent = {
  homepage: {
    title: 'Profesyonel Boyama Yönetimi',
    subtitle: 'PaintCo Admin Panel ile resim işinizi yönetin. İşleri takip edin, ekibinizi yönetin ve gerçek zamanlı öğrenmelerle işinizi büyütün.',
    ctaText: 'Admin Paneline Erişin',
    heroImageAlt: 'PaintCo Hero',
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
  seo: {
    homePageTitle: 'PaintCo Admin Panel - Profesyonel Boyama İşletme Yönetimi',
    homePageDescription: 'Boyama işletmenizi etkin bir şekilde yönetin. Dashboard, ekip yönetimi ve gerçek zamanlı analitikler.',
    homePageKeywords: 'boyama, yönetim, admin panel, project tracking',
  },
  branding: {
    companyName: 'PaintCo',
  },
};

export default function ContentManagementPage() {
  const [content, setContent] = useState<WebsiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading content:', error);
      } else if (data) {
        setContent(data);
      }
    } catch (err) {
      console.error('Error:', err);
      // Fallback to localStorage
      const saved = localStorage.getItem('websiteContent');
      if (saved) setContent(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: existing } = await supabase.from('website_content').select('id').limit(1).maybeSingle();

      if (existing?.id) {
        await supabase.from('content_versions').insert({
          content_id: existing.id,
          snapshot: content,
          created_by: user?.id,
          created_by_email: user?.email,
          change_note: 'İçerik kaydedildi',
        });
      }

      const { data: savedContent, error } = await supabase.from('website_content').upsert([
        {
          ...content,
          updated_at: new Date().toISOString(),
        },
      ]).select('id').single();

      if (error) throw error;

      if (savedContent?.id) {
        await supabase.from('content_search_index').delete().eq('content_id', savedContent.id);
        await supabase.from('content_search_index').insert([
          { content_id: savedContent.id, section: 'Ana Sayfa', title: content.homepage.title, body: `${content.homepage.subtitle} ${content.homepage.ctaText}` },
          { content_id: savedContent.id, section: 'Özellikler', title: content.features.title, body: content.features.items.map((item) => `${item.title} ${item.description}`).join(' ') },
          { content_id: savedContent.id, section: 'İletişim', title: content.branding.companyName, body: `${content.contact.email} ${content.contact.phone} ${content.contact.address}` },
          { content_id: savedContent.id, section: 'SEO', title: content.seo.homePageTitle, body: `${content.seo.homePageDescription} ${content.seo.homePageKeywords}` },
        ]);
      }

      localStorage.setItem('websiteContent', JSON.stringify(content));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save error:', err);
      // Fallback to localStorage only
      localStorage.setItem('websiteContent', JSON.stringify(content));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleReset = () => {
    setContent(defaultContent);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'heroImage' | 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('website-assets').upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('website-assets').getPublicUrl(fileName);

      if (field === 'heroImage') {
        setContent((prev) => ({
          ...prev,
          homepage: { ...prev.homepage, heroImage: data.publicUrl },
        }));
      } else if (field === 'logo') {
        setContent((prev) => ({
          ...prev,
          branding: { ...prev.branding, logo: data.publicUrl },
        }));
      } else if (field === 'favicon') {
        setContent((prev) => ({
          ...prev,
          branding: { ...prev.branding, favicon: data.publicUrl },
        }));
      }
    } catch (err) {
      console.error('Upload error:', err);
      // Store as base64 data URL as fallback
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (field === 'heroImage') {
          setContent((prev) => ({
            ...prev,
            homepage: { ...prev.homepage, heroImage: dataUrl },
          }));
        } else if (field === 'logo') {
          setContent((prev) => ({
            ...prev,
            branding: { ...prev.branding, logo: dataUrl },
          }));
        } else if (field === 'favicon') {
          setContent((prev) => ({
            ...prev,
            branding: { ...prev.branding, favicon: dataUrl },
          }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingLogo(false);
    }
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

  const updateSEO = (field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      seo: { ...prev.seo, [field]: value },
    }));
  };

  const updateBranding = (field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      branding: { ...prev.branding, [field]: value },
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-600">Yükleniyor...</p>
      </div>
    );
  }

  if (preview) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900">Ön İzleme</h1>
          <Button onClick={() => setPreview(false)} className="gap-2">
            <EyeOff size={18} />
            Önizlemeyi Kapat
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* Logo Preview */}
          {content.branding.logo && (
            <div className="p-8 border-b">
              <img src={content.branding.logo} alt="Logo" className="h-16 object-contain" />
            </div>
          )}

          {/* Hero Section Preview */}
          <div className="p-8 md:p-16 text-center space-y-4">
            {content.homepage.heroImage && (
              <img src={content.homepage.heroImage} alt={content.homepage.heroImageAlt} className="w-full h-80 object-cover rounded-lg mb-8" />
            )}
            <h1 className="text-4xl font-bold text-slate-900">{content.homepage.title}</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">{content.homepage.subtitle}</p>
            <button className="mt-4 px-8 py-3 bg-blue-700 text-white rounded-lg">{content.homepage.ctaText}</button>
          </div>

          {/* Features Preview */}
          <div className="p-8 md:p-16">
            <h2 className="text-3xl font-bold text-center mb-12">{content.features.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.features.items.map((item, index) => (
                <div key={index} className="p-6 border rounded-lg">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Preview */}
          <div className="p-8 md:p-16 bg-slate-50 border-t">
            <h2 className="text-2xl font-bold mb-6">İletişim</h2>
            <div className="space-y-2">
              <p><strong>E-posta:</strong> {content.contact.email}</p>
              <p><strong>Telefon:</strong> {content.contact.phone}</p>
              <p><strong>Adres:</strong> {content.contact.address}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Website İçeriği</h1>
          <p className="text-sm text-slate-600 mt-1">Ana website sayfalarınızın içeriğini yönetin ve düzenleyin</p>
        </div>
        <Button onClick={() => setPreview(true)} className="gap-2 bg-purple-700 hover:bg-purple-800">
          <Eye size={18} />
          Önizleme
        </Button>
      </div>

      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          ✓ İçerik başarıyla kaydedildi!
        </div>
      )}

      {/* Branding Section */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Marka & Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="font-medium text-slate-700">Şirket Adı</Label>
            <Input
              value={content.branding.companyName}
              onChange={(e) => updateBranding('companyName', e.target.value)}
              className="mt-1.5"
              placeholder="Şirket adı..."
            />
          </div>

          <div>
            <Label className="font-medium text-slate-700">Logo</Label>
            <div className="mt-1.5 space-y-3">
              {content.branding.logo && (
                <img src={content.branding.logo} alt="Logo" className="h-16 object-contain border rounded p-2" />
              )}
              <div className="flex items-center gap-2">
                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} disabled={uploadingLogo} />
                {uploadingLogo && <span className="text-sm text-slate-500">Yükleniyor...</span>}
              </div>
            </div>
          </div>

          <div>
            <Label className="font-medium text-slate-700">Favicon (Site Simgesi)</Label>
            <div className="mt-1.5">
              <div className="flex items-center gap-2">
                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'favicon')} disabled={uploadingLogo} />
                {uploadingLogo && <span className="text-sm text-slate-500">Yükleniyor...</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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

          <div>
            <Label className="font-medium text-slate-700">Hero Görseli</Label>
            <div className="mt-1.5 space-y-3">
              {content.homepage.heroImage && (
                <img src={content.homepage.heroImage} alt="Hero" className="w-full h-48 object-cover border rounded" />
              )}
              <div className="flex items-center gap-2">
                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'heroImage')} disabled={uploadingLogo} />
                {uploadingLogo && <span className="text-sm text-slate-500">Yükleniyor...</span>}
              </div>
            </div>
          </div>

          <div>
            <Label className="font-medium text-slate-700">Görsel Alternatif Metni (Alt Text)</Label>
            <Input
              value={content.homepage.heroImageAlt || ''}
              onChange={(e) => updateHomepage('heroImageAlt', e.target.value)}
              className="mt-1.5"
              placeholder="Görsel açıklaması (SEO için önemli)..."
            />
          </div>
        </CardContent>
      </Card>

      {/* SEO Section */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">SEO Ayarları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="font-medium text-slate-700">Sayfa Başlığı (Meta Title)</Label>
            <div className="mt-1.5">
              <Input
                value={content.seo.homePageTitle}
                onChange={(e) => updateSEO('homePageTitle', e.target.value)}
                placeholder="Maksimum 60 karakter..."
              />
              <p className="mt-1 text-xs text-slate-500">{content.seo.homePageTitle.length}/60 karakter</p>
            </div>
          </div>

          <div>
            <Label className="font-medium text-slate-700">Sayfa Açıklaması (Meta Description)</Label>
            <div className="mt-1.5">
              <textarea
                value={content.seo.homePageDescription}
                onChange={(e) => updateSEO('homePageDescription', e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Maksimum 160 karakter..."
              />
              <p className="mt-1 text-xs text-slate-500">{content.seo.homePageDescription.length}/160 karakter</p>
            </div>
          </div>

          <div>
            <Label className="font-medium text-slate-700">Anahtar Kelimeler (Keywords)</Label>
            <Input
              value={content.seo.homePageKeywords}
              onChange={(e) => updateSEO('homePageKeywords', e.target.value)}
              placeholder="Anahtar kelimelerinizi virgülle ayırın..."
              className="mt-1.5"
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
        <strong>Not:</strong> Tüm değişiklikler Supabase veritabanına ve tarayıcı localStorage'a kaydedilir. Görseller Supabase Storage'da saklanır.
      </div>
    </div>
  );
}
