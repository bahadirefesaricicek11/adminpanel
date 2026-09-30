import { createClient } from '@/lib/supabase/client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  created_at?: string;
}

export interface Job {
  id: string;
  title: string;
  customer: string;
  type: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  start_date?: string;
  due_date?: string;
  budget: number;
  created_at?: string;
}

// Client-side istekleri için istemci çağrısı
const getSupabase = () => createClient();

// Fetch all users
export async function fetchUsers(): Promise<User[]> {
  try {
    const { data, error } = await getSupabase()
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// Fetch all jobs
export async function fetchJobs(): Promise<Job[]> {
  try {
    const { data, error } = await getSupabase()
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

// Create a new user
export async function createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User | null> {
  try {
    const { data, error } = await getSupabase()
      .from('users')
      .insert([user])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// Update a user
export async function updateUser(
  id: string,
  updates: Partial<Omit<User, 'id' | 'created_at'>>
): Promise<User | null> {
  try {
    const { data, error } = await getSupabase()
      .from('users')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

// Delete a user
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const { error } = await getSupabase().from('users').delete().eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

// Create a new job
export async function createJob(job: Omit<Job, 'id' | 'created_at' | 'progress'> & { progress?: number }): Promise<Job | null> {
  try {
    const { data, error } = await getSupabase()
      .from('jobs')
      .insert([job])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error creating job:', error);
    return null;
  }
}

// Update a job
export async function updateJob(
  id: string,
  updates: Partial<Omit<Job, 'id' | 'created_at'>>
): Promise<Job | null> {
  try {
    const { data, error } = await getSupabase()
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error updating job:', error);
    return null;
  }
}

// Delete a job
export async function deleteJob(id: string): Promise<boolean> {
  try {
    const { error } = await getSupabase().from('jobs').delete().eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting job:', error);
    return false;
  }
}

// Get dashboard stats
export async function getDashboardStats() {
  try {
    const supabase = getSupabase();
    const [
      { count: totalUsers },
      { count: activeUsers },
      { count: totalJobs },
      { count: completedJobs },
      { count: pendingJobs },
      { data: revenueData }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('jobs').select('budget'),
    ]);

    const totalRevenue = revenueData?.reduce((sum, j) => sum + (j.budget || 0), 0) || 0;

    return {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      totalJobs: totalJobs || 0,
      completedJobs: completedJobs || 0,
      pendingJobs: pendingJobs || 0,
      totalRevenue,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalJobs: 0,
      completedJobs: 0,
      pendingJobs: 0,
      totalRevenue: 0,
    };
  }
}