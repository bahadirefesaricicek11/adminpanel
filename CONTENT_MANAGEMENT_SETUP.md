# Website Content Management - Setup Guide

## ✅ Features Added

Your content management page now includes:

### 1. **Image Upload Management**
- Upload and display logos
- Upload hero images for homepage
- Upload favicons (site icons)
- Images stored in Supabase Storage (with localStorage fallback)
- Real-time preview of uploaded images

### 2. **SEO Metadata Editing**
- Meta title (60 character limit with counter)
- Meta description (160 character limit with counter)
- Keywords/tags
- Open Graph preparation (structure in place)
- Character counters to guide optimal SEO lengths

### 3. **Page Preview Functionality**
- Real-time preview of website as you edit
- See exactly how your content appears
- Logo header preview
- Hero section with image preview
- Features grid preview
- Contact section preview
- Mobile-responsive preview design

### 4. **Branding Section**
- Company name management
- Logo upload & display
- Favicon (site icon) upload
- Stored in `branding` JSONB field

### 5. **Multi-Section Management**
- **Homepage**: Title, subtitle, CTA text, hero image
- **Features**: 6 customizable cards with titles and descriptions
- **Contact**: Email, phone, address
- **SEO**: Meta title, description, keywords
- **Branding**: Logo, favicon, company name

---

## 🚀 Setup Instructions

### Step 1: Create Supabase Storage Bucket

Go to your [Supabase Dashboard](https://supabase.com/dashboard):

1. Navigate to **Storage** section (left sidebar)
2. Click **New Bucket**
3. Enter bucket name: `website-assets`
4. Uncheck "Private bucket" (to make it public for image URLs)
5. Click **Create Bucket**

### Step 2: Set Storage Bucket Permissions

In the same Storage section:

1. Click on `website-assets` bucket name
2. Click **Policies** tab
3. Click **New Policy** → **For SELECT**
4. Choose "Public access - Allow all"
5. Click **Save**
6. Click **New Policy** → **For INSERT**
7. Choose "Authenticated users can upload" or "Public access"
8. Click **Save**

### Step 3: Create Database Table

Run the migration SQL on your Supabase database:

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Copy the SQL from `supabase/migrations/20240115_create_website_content_table.sql`
4. Paste it into the query editor
5. Click **Run**
6. Verify the table `website_content` was created

**Or directly run:**
```sql
-- Paste the contents of: supabase/migrations/20240115_create_website_content_table.sql
```

### Step 4: Environment Variables

Your `.env.local` should already have these (no changes needed):
```env
NEXT_PUBLIC_SUPABASE_URL=https://pcxjxdmlhmmpbyarmryb.supabase.co/
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 5: Test the Features

1. Start dev server: `npm run dev`
2. Navigate to **Admin Panel** → **Website İçeriği**
3. Try uploading an image (logo, hero image, favicon)
4. Edit SEO metadata (notice character counters)
5. Click **Önizleme** (Preview) button to see real-time preview
6. Click **Değişiklikleri Kaydet** (Save Changes) to save to database

---

## 📊 Data Structure

The `website_content` table stores everything as JSONB:

```json
{
  "homepage": {
    "title": "string",
    "subtitle": "string",
    "ctaText": "string",
    "heroImage": "url or base64",
    "heroImageAlt": "string"
  },
  "features": {
    "title": "string",
    "items": [
      {"title": "string", "description": "string"},
      ...
    ]
  },
  "contact": {
    "email": "string",
    "phone": "string",
    "address": "string"
  },
  "seo": {
    "homePageTitle": "string (max 60)",
    "homePageDescription": "string (max 160)",
    "homePageKeywords": "string"
  },
  "branding": {
    "logo": "url or base64",
    "favicon": "url or base64",
    "companyName": "string"
  }
}
```

---

## 🔐 Security Notes

- All authenticated users can view and edit content
- Row-Level Security (RLS) policies enabled
- Images stored with public read access (configurable)
- localStorage used as fallback for offline support
- All edits tracked with `updated_at` timestamp

---

## 📱 Mobile Responsiveness

The preview page is fully responsive:
- Desktop views (1920px)
- Tablet views (768px) 
- Mobile views (375px)
- All handled via CSS and grid layouts

---

## 🎯 Next Steps

### Optional Enhancements:

1. **Add Multiple Languages**
   - Duplicate content structure for EN/FR/DE
   - Add language selector to content page

2. **Version History**
   - Track content change history
   - Restore previous versions
   - Add `version` field to track changes

3. **Publishing Schedule**
   - Schedule content to go live at specific times
   - Draft/Published status
   - Preview unreleased versions

4. **Bulk Image Management**
   - Image gallery view
   - Reuse uploaded images across sections
   - Image optimization & compression

5. **Connect to Frontend Website**
   - Fetch content from Supabase in public website
   - Dynamic homepage, features, contact
   - Real-time updates

---

## 🆘 Troubleshooting

**Images not uploading?**
- Check Supabase Storage bucket exists and is public
- Verify authentication token in requests
- Check browser console for errors

**Content not saving to database?**
- Verify RLS policies allow authenticated users
- Check Supabase URL and keys in `.env.local`
- Look at server logs for database errors

**Preview not showing?**
- Click "Önizleme" button to enter preview mode
- Make sure you've filled in at least one field
- Use "Değişiklikleri Kaydet" to persist data first

---

## 📝 File Locations

- **Content Page**: `/app/admin/dashboard/content/page.tsx`
- **Supabase Client**: `/lib/supabase/client.ts`
- **Migration SQL**: `/supabase/migrations/20240115_create_website_content_table.sql`

---

## ✨ Features Summary

| Feature | Status | Details |
|---------|--------|---------|
| Image Upload | ✅ | Logo, hero, favicon with preview |
| SEO Metadata | ✅ | Title, description, keywords with char counters |
| Page Preview | ✅ | Real-time preview mode with layout preview |
| Branding | ✅ | Company info and visual assets |
| Database | ✅ | Supabase PostgreSQL with JSONB |
| Storage | ✅ | Supabase Storage for images |
| Offline Support | ✅ | localStorage fallback |
| Character Counters | ✅ | SEO compliance guidance |

---

**Tip**: The first time you save, it creates a new entry in the database. Subsequently, it updates the same entry. You can have multiple entries if needed by adding a `name` field.

Enjoy managing your website content! 🚀
