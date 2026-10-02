import { createClient } from '@/lib/supabase/client';

export type AdminRole = 'owner' | 'admin' | 'editor' | 'viewer';

const rolePermissions: Record<AdminRole, string[]> = {
  owner: ['manage_users', 'edit_content', 'view_content', 'view_analytics', 'manage_settings'],
  admin: ['manage_users', 'edit_content', 'view_content', 'view_analytics', 'manage_settings'],
  editor: ['edit_content', 'view_content', 'view_analytics'],
  viewer: ['view_content', 'view_analytics'],
};

export async function getCurrentAdminProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('admin_profiles')
    .select('user_id, display_name, role, is_active')
    .eq('user_id', user.id)
    .maybeSingle();

  return data ?? {
    user_id: user.id,
    display_name: user.email,
    role: user.email === 'bahadirefesaricicek11@gmail.com' ? 'owner' : 'viewer',
    is_active: true,
  };
}

export function can(role: AdminRole | undefined, permission: string) {
  return Boolean(role && rolePermissions[role]?.includes(permission));
}
