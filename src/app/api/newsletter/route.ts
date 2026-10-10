import { NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/validations';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = newsletterSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    const { email } = result.data;

    const adminSupabase = createAdminSupabaseClient();
    if (adminSupabase) {
      const { error } = await adminSupabase
        .from('newsletter_subscribers')
        .insert({ email })
        .select()
        .single();

      if (error && error.code !== '23505') {
        // 23505 is unique violation, which means already subscribed
        console.error('Newsletter error:', error);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Subscribed successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}
