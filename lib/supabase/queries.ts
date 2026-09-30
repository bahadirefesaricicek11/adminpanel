import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Publishable Key');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch all users
export async function fetchUsers() {
  try {
    const { data, error } = await supabase
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
export async function fetchJobs() {
  try {
    const { data, error } = await supabase
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
export async function createUser(user: {
  name: string;
  email: string;
  role: string;
}) {
  try {
    const { data, error } = await supabase
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
  updates: Partial<{ name: string; email: string; role: string; status: string }>
) {
  try {
    const { data, error } = await supabase
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
export async function deleteUser(id: string) {
  try {
    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

// Create a new job
export async function createJob(job: {
  title: string;
  customer: string;
  type: string;
  status?: string;
  budget: number;
}) {
  try {
    const { data, error } = await supabase
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
  updates: Partial<{
    title: string;
    customer: string;
    type: string;
    status: string;
    progress: number;
    budget: number;
  }>
) {
  try {
    const { data, error } = await supabase
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
export async function deleteJob(id: string) {
  try {
    const { error } = await supabase.from('jobs').delete().eq('id', id);

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
    const [usersData, jobsData] = await Promise.all([
      supabase.from('users').select('*'),
      supabase.from('jobs').select('*'),
    ]);

    const users = usersData.data || [];
    const jobs = jobsData.data || [];

    return {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.status === 'active').length,
      totalJobs: jobs.length,
      completedJobs: jobs.filter((j) => j.status === 'completed').length,
      pendingJobs: jobs.filter((j) => j.status === 'pending').length,
      totalRevenue: jobs.reduce((sum, j) => sum + (j.budget || 0), 0),
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
