import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Attempt Supabase Auth first
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.session) {
        const cookieStore = await cookies();
        cookieStore.set('admin_session', data.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });

        return NextResponse.json({ success: true, user: data.user });
      }
    }

    // Default admin fallback for initial setup / testing
    const defaultEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@firstquality.in';
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'FirstQuality@2024';

    if (email === defaultEmail && password === defaultPassword) {
      const cookieStore = await cookies();
      cookieStore.set('admin_session', 'authenticated_admin_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return NextResponse.json({
        success: true,
        user: { email: defaultEmail, role: 'admin' },
      });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  return NextResponse.json({ success: true });
}
