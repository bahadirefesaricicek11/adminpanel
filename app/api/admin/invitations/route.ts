import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const allowedRoles = new Set(['admin', 'editor', 'viewer']);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ message: 'Oturum gerekli.' }, { status: 401 });

    const { data: profile } = await supabase.from('admin_profiles').select('role').eq('user_id', user.id).maybeSingle();
    const isOwner = user.email === 'bahadirefesaricicek11@gmail.com' || profile?.role === 'owner' || profile?.role === 'admin';
    if (!isOwner) return NextResponse.json({ message: 'Davet gönderme yetkiniz yok.' }, { status: 403 });

    const { email, role } = await request.json();
    if (typeof email !== 'string' || !email.includes('@') || !allowedRoles.has(role)) {
      return NextResponse.json({ message: 'Geçersiz davet bilgileri.' }, { status: 400 });
    }

    const token = crypto.randomUUID();
    const { error } = await supabase.from('admin_invitations').insert({ email, role, token, invited_by: user.id });
    if (error) throw error;

    const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin}/admin/login?invite=${token}`;
    let message = `Davet oluşturuldu: ${email}`;

    if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM,
          to: [email],
          subject: 'PaintCo yönetim paneli daveti',
          html: `<p>PaintCo yönetim paneline davet edildiniz.</p><p>Rolünüz: <strong>${role}</strong></p><p><a href="${inviteUrl}">Daveti kabul etmek için giriş yapın</a></p>`,
        }),
      });
      if (!emailResponse.ok) message = `Davet oluşturuldu ancak e-posta gönderilemedi: ${email}`;
      else message = `Davet e-postası gönderildi: ${email}`;
    } else {
      message = `Davet oluşturuldu: ${email}. E-posta için RESEND_API_KEY ve EMAIL_FROM ayarlayın.`;
    }

    await supabase.from('admin_notifications').insert({
      user_id: user.id,
      title: 'Yeni kullanıcı daveti',
      message,
      type: 'success',
      link: '/admin/dashboard/roles',
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Invitation error:', error);
    return NextResponse.json({ message: 'Davet oluşturulamadı.' }, { status: 500 });
  }
}
