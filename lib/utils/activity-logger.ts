import { createClient } from '@/lib/supabase/client';

export type ActivityAction = 
  | 'login' 
  | 'logout' 
  | 'view_page' 
  | 'edit_content' 
  | 'create_content' 
  | 'delete_content' 
  | 'upload_file' 
  | 'change_password' 
  | 'update_settings'
  | 'invite_user'
  | 'remove_user';

interface LogActivityOptions {
  action: ActivityAction;
  resourceType?: string;
  resourceId?: string;
  resourceName?: string;
  changes?: Record<string, any>;
}

export async function logActivity(options: LogActivityOptions) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
    
    // Get IP address from headers (this will be handled server-side)
    const ipAddress = await getClientIp();

    await supabase.from('activity_logs').insert([
      {
        user_id: user.id,
        user_email: user.email,
        action: options.action,
        resource_type: options.resourceType,
        resource_id: options.resourceId,
        resource_name: options.resourceName,
        changes: options.changes || null,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: 'success',
        timestamp: new Date().toISOString(),
      },
    ]);
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

export async function logActivityError(
  options: LogActivityOptions,
  error: Error
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
    const ipAddress = await getClientIp();

    await supabase.from('activity_logs').insert([
      {
        user_id: user.id,
        user_email: user.email,
        action: options.action,
        resource_type: options.resourceType,
        resource_id: options.resourceId,
        resource_name: options.resourceName,
        changes: options.changes || null,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: 'error',
        error_message: error.message,
        timestamp: new Date().toISOString(),
      },
    ]);
  } catch (err) {
    console.error('Failed to log activity error:', err);
  }
}

async function getClientIp(): Promise<string> {
  try {
    // Try to get IP from ipify API
    const response = await fetch('https://api.ipify.org?format=json', {
      cache: 'no-cache',
    });
    const data = await response.json();
    return data.ip || 'unknown';
  } catch {
    return 'unknown';
  }
}

export async function logSessionStart(userId: string, userEmail: string) {
  try {
    const supabase = createClient();
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
    const ipAddress = await getClientIp();

    const { data } = await supabase
      .from('session_logs')
      .insert([
        {
          user_id: userId,
          user_email: userEmail,
          ip_address: ipAddress,
          user_agent: userAgent,
          status: 'active',
          last_activity_timestamp: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    return data?.id;
  } catch (error) {
    console.error('Failed to log session start:', error);
  }
}

export async function logSessionEnd(userId: string, sessionStartTime: number) {
  try {
    const supabase = createClient();
    const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);

    await supabase
      .from('session_logs')
      .update({
        logout_timestamp: new Date().toISOString(),
        status: 'closed',
        session_duration_seconds: sessionDuration,
      })
      .eq('user_id', userId)
      .is('logout_timestamp', null);
  } catch (error) {
    console.error('Failed to log session end:', error);
  }
}
