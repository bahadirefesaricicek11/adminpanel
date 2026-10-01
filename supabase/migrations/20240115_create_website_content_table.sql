-- Create website_content table
CREATE TABLE IF NOT EXISTS website_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  homepage JSONB DEFAULT '{
    "title": "Profesyonel Boyama Yönetimi",
    "subtitle": "PaintCo Admin Panel ile resim işinizi yönetin.",
    "ctaText": "Admin Paneline Erişin",
    "heroImage": null,
    "heroImageAlt": "PaintCo Hero"
  }',
  features JSONB DEFAULT '{
    "title": "Özellikler",
    "items": []
  }',
  contact JSONB DEFAULT '{
    "email": "admin@paintco.com",
    "phone": "+90 (555) 123-4567",
    "address": "İstanbul, Türkiye"
  }',
  seo JSONB DEFAULT '{
    "homePageTitle": "PaintCo Admin Panel",
    "homePageDescription": "Admin panel açıklaması",
    "homePageKeywords": "admin, panel, yönetim"
  }',
  branding JSONB DEFAULT '{
    "logo": null,
    "favicon": null,
    "companyName": "PaintCo"
  }',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Supabase Storage bucket for website assets
-- Note: This is done through the Supabase Dashboard UI, but documenting here:
-- CREATE STORAGE BUCKET website-assets IF NOT EXISTS;

-- Enable RLS on website_content table
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view all content
CREATE POLICY "Allow authenticated users to view content"
  ON website_content FOR SELECT
  USING (auth.role() = 'authenticated_user');

-- Allow authenticated users to update content
CREATE POLICY "Allow authenticated users to update content"
  ON website_content FOR UPDATE
  USING (auth.role() = 'authenticated_user');

-- Allow authenticated users to insert content
CREATE POLICY "Allow authenticated users to insert content"
  ON website_content FOR INSERT
  WITH CHECK (auth.role() = 'authenticated_user');

-- Create index on updated_at for faster queries
CREATE INDEX IF NOT EXISTS website_content_updated_at_idx 
ON website_content(updated_at DESC);
