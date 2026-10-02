-- Production admin features: roles, invitations, notifications, versions, and searchable content.

ALTER TABLE IF EXISTS activity_logs ADD COLUMN IF NOT EXISTS metadata JSONB;

CREATE TABLE IF NOT EXISTS admin_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  token TEXT NOT NULL UNIQUE,
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES website_content(id) ON DELETE CASCADE,
  snapshot JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by_email TEXT,
  change_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  link TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_search_index (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES website_content(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  search_document TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(body, ''))
  ) STORED
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_search_index ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND is_active = TRUE
  ) OR EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND email = 'bahadirefesaricicek11@gmail.com'
  );
$$;

CREATE OR REPLACE FUNCTION public.has_admin_permission(required_permission TEXT)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE required_permission
    WHEN 'manage_users' THEN public.is_admin_user()
    WHEN 'edit_content' THEN EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'editor') AND is_active = TRUE
    ) OR EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email = 'bahadirefesaricicek11@gmail.com')
    WHEN 'view_content' THEN EXISTS (
      SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid() AND is_active = TRUE
    ) OR EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email = 'bahadirefesaricicek11@gmail.com')
    ELSE FALSE
  END;
$$;

CREATE POLICY "Admins manage profiles" ON admin_profiles FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
CREATE POLICY "Admins manage invitations" ON admin_invitations FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
CREATE POLICY "Editors create versions" ON content_versions FOR INSERT WITH CHECK (public.has_admin_permission('edit_content'));
CREATE POLICY "Admins view versions" ON content_versions FOR SELECT USING (public.has_admin_permission('view_content'));
CREATE POLICY "Users view notifications" ON admin_notifications FOR SELECT USING (user_id = auth.uid() OR public.is_admin_user());
CREATE POLICY "Users update notifications" ON admin_notifications FOR UPDATE USING (user_id = auth.uid() OR public.is_admin_user());
CREATE POLICY "System creates notifications" ON admin_notifications FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users search content" ON content_search_index FOR SELECT USING (public.has_admin_permission('view_content'));

CREATE INDEX IF NOT EXISTS content_versions_created_at_idx ON content_versions(created_at DESC);
CREATE INDEX IF NOT EXISTS admin_notifications_user_read_idx ON admin_notifications(user_id, read_at, created_at DESC);
CREATE INDEX IF NOT EXISTS content_search_document_idx ON content_search_index USING GIN(search_document);

INSERT INTO admin_profiles (user_id, display_name, role)
SELECT id, 'Sistem Sahibi', 'owner' FROM auth.users
WHERE email = 'bahadirefesaricicek11@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'owner', updated_at = NOW();
