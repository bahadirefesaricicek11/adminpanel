'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createUserAction(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;

  const { error } = await supabase.from('users').insert([
    { name, email, role, status: 'active' }
  ]);

  if (error) {
    throw new Error(`Kullanıcı eklenirken hata oluştu: ${error.message}`);
  }

  // Admin kullanıcı listesini yenileyerek önbelleği temizle
  revalidatePath('/admin/users');
}

export async function deleteUserAction(userId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('users').delete().eq('id', userId);

  if (error) {
    throw new Error(`Kullanıcı silinemedi: ${error.message}`);
  }

  revalidatePath('/admin/users');
}