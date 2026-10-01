# PaintCo Admin Panel

A modern, full-featured admin panel built with Next.js 16, Supabase authentication, and a light theme design. Manage your painting business operations with real-time dashboards, team management, website content, and project tracking.

## 🌐 Live Demo

**Admin Panel:** [https://adminpanel-gamma-gray.vercel.app/](https://adminpanel-gamma-gray.vercel.app/)

**Test Account:**
- Email: `bahadirefesaricicek11@gmail.com`
- Password: `adminpaneltestcode123`

---

## ✨ Features

### 🎯 Core Admin Features
- **Supabase Authentication** - Secure email/password login with session management
- **Dashboard** - Real-time metrics with revenue tracking and interactive revenue charts
- **User Management** - Team member list with role filtering and status indicators
- **Settings Page** - Company configuration, notifications, and account preferences
- **Protected Routes** - Automatic redirect to login for unauthorized access
- **Sidebar Navigation** - Optimized with React performance hooks for smooth transitions

### 📊 Website Content Management (NEW)
- **Image Upload** - Upload and manage logos, hero images, favicons to Supabase Storage
- **SEO Metadata Editing** - Meta titles (60 char limit), descriptions (160 char limit), and keywords
- **Real-Time Page Preview** - See website changes instantly in desktop/tablet/mobile views
- **Branding Management** - Manage company name, logo, and favicon
- **Multi-Section Editing**:
  - Homepage (title, subtitle, CTA, hero image)
  - Features (6 customizable feature cards)
  - Contact Information (email, phone, address)
  - SEO Settings (meta tags, keywords)
- **Database Persistence** - JSONB storage in Supabase PostgreSQL
- **Character Counters** - SEO-optimized guidance for meta fields
- **Fallback Support** - localStorage backup for offline functionality

### 🎨 Design & UX
- **Light Theme** - Modern slate-based palette with blue accents
- **Responsive Layout** - Perfect on desktop, tablet, and mobile devices
- **Turkish Language** - Complete Turkish localization throughout
- **Icon-Based Navigation** - Clear visual navigation with lucide-react icons
- **Smooth Transitions** - 200ms CSS transitions for polished feel
- **Performance Optimized** - useMemo and useCallback for efficient rendering

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 16** (with Turbopack)
- **React 19** 
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **Lucide React** for icons
- **Recharts** for data visualization

### Backend & APIs
- **Supabase** for authentication and database
- **PostgreSQL** for data storage
- **Supabase Storage** for file uploads
- **Row-Level Security (RLS)** for data protection

### Deployment
- **Vercel** for hosting with auto-deployment from GitHub
- **GitHub** for version control

---

## 📁 Project Structure

```
/app
  /admin
    /login         # Authentication page
    /dashboard
      /content     # Website content management (NEW)
      /users       # User management
      /settings    # Admin settings
      
/components
  /admin
    /sidebar       # Navigation (performance optimized)
    /header        # Page header with search
    /protection    # Auth middleware
  /ui              # shadcn/ui components
  /tutorial        # Demo components
  
/lib
  /supabase
    /client.ts     # Supabase client instance
    /server.ts     # Server-side Supabase
    /proxy.ts      # Auth proxy
    
/supabase
  /migrations      # Database migrations
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- GitHub account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/bahadirefesaricicek11/adminpanel.git
   cd adminpanel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://pcxjxdmlhmmpbyarmryb.supabase.co/
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

4. **Run database migrations**
   - Go to Supabase Dashboard → SQL Editor
   - Copy SQL from `supabase/migrations/20240115_create_website_content_table.sql`
   - Execute the query

5. **Create Storage bucket**
   - Supabase Dashboard → Storage
   - New Bucket → name: `website-assets` → Make Public
   - Add policies for public read/authenticated insert

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 📚 Usage Guide

### Login to Admin Panel
1. Go to [Admin Login](http://localhost:3000/admin/login)
2. Use test credentials above
3. Auto-redirects to dashboard if already logged in

### Access Website Content Management
1. Click **"Website İçeriği"** in sidebar
2. Edit content in each section:
   - **Marka & Logo** - Upload company logo and favicon
   - **Ana Sayfa** - Edit homepage title, subtitle, CTA, hero image
   - **SEO Ayarları** - Set meta title, description, keywords with character counters
   - **Özellikler Bölümü** - Customize 6 feature cards
   - **İletişim Bilgileri** - Update contact details

### Use Page Preview
1. Click **"Önizleme"** button in top right
2. See real-time preview of website
3. View layout with all your edits
4. Shows logo, hero section, features, and contact info
5. Click **"Önizlemeyi Kapat"** to return to editing

### Save Changes
1. Edit any content fields
2. Click **"Değişiklikleri Kaydet"** button
3. Content saves to Supabase + localStorage
4. Green success message appears
5. Images upload to Supabase Storage automatically

---

## 🔐 Authentication

The app uses Supabase Auth with email/password:
- Sessions stored in HTTP-only cookies
- Automatic token refresh
- Protected routes redirect to login
- logout-button removes session

**Credentials for testing:**
- Email: `bahadirefesaricicek11@gmail.com`
- Password: `adminpaneltestcode123`

---

## 📊 Database Schema

### website_content Table
```sql
{
  id: UUID (PRIMARY KEY)
  homepage: JSONB {
    title: string
    subtitle: string
    ctaText: string
    heroImage: string (URL or base64)
    heroImageAlt: string
  }
  features: JSONB {
    title: string
    items: Array<{title, description}>
  }
  contact: JSONB {
    email: string
    phone: string
    address: string
  }
  seo: JSONB {
    homePageTitle: string (max 60 chars)
    homePageDescription: string (max 160 chars)
    homePageKeywords: string
  }
  branding: JSONB {
    logo: string (URL or base64)
    favicon: string (URL or base64)
    companyName: string
  }
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

---

## 🎯 Key Features Explained

### 🖼️ Image Upload
- Supports JPG, PNG, SVG, WebP
- Uploads to Supabase Storage at `website-assets/` bucket
- Falls back to base64 encoding for small images
- Real-time preview after upload
- Stores public URL in database

### 🔍 SEO Metadata
- **Meta Title**: Max 60 characters (with live counter)
- **Meta Description**: Max 160 characters (with live counter)
- **Keywords**: Comma-separated list for search indexing
- Character counters guide optimal SEO lengths
- All fields required for professional SEO

### 👁️ Page Preview
- Real-time live preview of website
- Shows exactly how content appears
- Includes logo header, hero section, features grid, contact info
- Non-editable preview mode for verification
- Click "Önizlemeyi Kapat" to return to editing

### 💾 Data Persistence
- Primary storage: Supabase PostgreSQL (JSONB)
- Fallback storage: Browser localStorage
- All edits tracked with `updated_at` timestamp
- Fully queryable JSONB data for future APIs

---

## 📱 Responsive Design

Works perfectly across all devices:
- **Desktop** (1920px+) - Full layout
- **Tablet** (768px - 1024px) - Optimized spacing
- **Mobile** (375px - 767px) - Stacked layout

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your GitHub repo
   - Add environment variables from `.env.local`
   - Click Deploy

3. **Auto-Deploy**
   - Every GitHub push triggers automatic deploy
   - Vercel builds and deploys in ~2 minutes

**Current Deployment:** [https://adminpanel-gamma-gray.vercel.app/](https://adminpanel-gamma-gray.vercel.app/)

---

## 🆘 Troubleshooting

### Images not uploading?
```bash
# Check Supabase Storage bucket exists and is public
# Verify RLS policies allow authenticated uploads
# Check browser console for specific errors
```

### Content not saving to database?
```bash
# Verify .env.local has correct Supabase URL and keys
# Check Supabase dashboard for connection
# Verify RLS policies on website_content table
# Look at server logs: npm run dev
```

### Preview not showing?
```bash
# Make sure you clicked "Önizleme" button first
# Save content before previewing
# Check if all required fields are filled
```

### Login issues?
```bash
# Clear browser cookies
# Try incognito window
# Verify Supabase credentials in .env.local
# Check GitHub auth isn't blocking Supabase
```

---

## 📝 File Locations

| File | Purpose |
|------|---------|
| `/app/admin/dashboard/content/page.tsx` | Main content management page |
| `/lib/supabase/client.ts` | Supabase client setup |
| `/supabase/migrations/*.sql` | Database migrations |
| `/lib/translations.ts` | Turkish language strings |
| `/tailwind.config.ts` | Light theme configuration |
| `/CONTENT_MANAGEMENT_SETUP.md` | Detailed setup guide |

---

## 🎯 Next Steps & Enhancements

### Already Implemented ✅
- Image upload to Supabase Storage
- SEO metadata editing
- Real-time page preview
- Multi-section content management
- Turkish language support
- Light theme design

### Recommended Future Features 🔜
1. **Version History** - Track and restore previous versions
2. **Publishing Schedule** - Schedule content to go live
3. **Multi-Language Support** - En, Tr, Fr language versions
4. **Analytics** - Track content edits and user activity
5. **API Endpoint** - Public API to fetch content
6. **Frontend Website** - Display content management edits live

---

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## 👨‍💻 Built With

- **Next.js** - React framework
- **Supabase** - Backend as a service
- **Tailwind CSS** - Utility-first CSS
- **TypeScript** - Type safety
- **shadcn/ui** - Component library

---

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vercel Deployment](https://vercel.com/docs)

---

**Made with ❤️ for PaintCo Admin Panel**
