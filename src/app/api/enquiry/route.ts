import { NextResponse } from 'next/server';
import { enquiryFormSchema } from '@/lib/validations';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = enquiryFormSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form submission', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { fullName, businessName, phone, email, enquiryType, message } = result.data;

    // Persist to Supabase if available
    const adminSupabase = createAdminSupabaseClient();
    if (adminSupabase) {
      const { error } = await adminSupabase.from('enquiries').insert({
        full_name: fullName,
        business_name: businessName || null,
        phone,
        email: email || null,
        enquiry_type: enquiryType || 'wholesale',
        message: message || null,
        status: 'new',
      });

      if (error) {
        console.error('Supabase enquiry insertion error:', error);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Enquiry received successfully. Our team will contact you shortly.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Enquiry API error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing enquiry' },
      { status: 500 }
    );
  }
}
