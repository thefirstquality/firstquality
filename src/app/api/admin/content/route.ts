import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

function triggerRevalidation() {
  try {
    revalidatePath('/');
    revalidatePath('/contact');
    revalidatePath('/products');
    revalidatePath('/farms');
    revalidatePath('/about');
    revalidatePath('/enquiry');
  } catch {
    // Ignore in non-cached contexts
  }
}

// Tables allowed for Admin CRUD operations
const ALLOWED_TABLES = [
  'site_settings',
  'hero_section',
  'hero_benefits',
  'about_section',
  'about_features',
  'statistics',
  'why_choose_items',
  'product_categories',
  'products',
  'sourcing_philosophy',
  'sourcing_pillars',
  'farm_videos',
  'testimonials',
  'enquiries',
  'seo_metadata',
];

// GET records from a table
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');

    if (!table || !ALLOWED_TABLES.includes(table)) {
      return NextResponse.json({ error: 'Invalid table requested' }, { status: 400 });
    }

    const admin = createAdminSupabaseClient();
    if (!admin) {
      return NextResponse.json({
        data: [],
        note: 'Supabase credentials not configured in environment. Using baseline data.',
      });
    }

    let query = admin.from(table).select('*');
    if (['hero_benefits', 'about_features', 'statistics', 'why_choose_items', 'product_categories', 'products', 'sourcing_pillars', 'farm_videos', 'testimonials'].includes(table)) {
      query = query.order('sort_order', { ascending: true });
    } else if (table === 'enquiries') {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST create record
export async function POST(request: Request) {
  try {
    const { table, data } = await request.json();

    if (!table || !ALLOWED_TABLES.includes(table) || !data) {
      return NextResponse.json({ error: 'Invalid table or data payload' }, { status: 400 });
    }

    const payload = { ...data };
    if (table === 'site_settings' && payload.whatsapp_number) {
      payload.whatsapp_url = buildWhatsAppUrl(payload.whatsapp_number);
    }

    const admin = createAdminSupabaseClient();
    if (!admin) {
      return NextResponse.json({
        success: true,
        data: { ...payload, id: `local-${Date.now()}` },
        note: 'Local simulation. To persist permanently, connect Supabase.',
      });
    }

    const { data: inserted, error } = await admin.from(table).insert(payload).select().single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    triggerRevalidation();

    return NextResponse.json({ success: true, data: inserted });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PUT / PATCH update record
export async function PUT(request: Request) {
  try {
    const { table, id, data } = await request.json();

    if (!table || !ALLOWED_TABLES.includes(table) || !data) {
      return NextResponse.json({ error: 'Invalid update payload' }, { status: 400 });
    }

    const payload = { ...data };
    if (table === 'site_settings' && payload.whatsapp_number) {
      payload.whatsapp_url = buildWhatsAppUrl(payload.whatsapp_number);
    }

    const admin = createAdminSupabaseClient();
    if (!admin) {
      return NextResponse.json({
        success: true,
        data: { ...payload, id },
        note: 'Local simulation.',
      });
    }

    let targetId = id;

    // For single-row configuration tables, auto-fallback to existing record or insert if empty
    if (!targetId && ['hero_section', 'site_settings', 'about_section', 'sourcing_philosophy'].includes(table)) {
      const { data: existing } = await admin.from(table).select('id').limit(1);
      if (existing && existing.length > 0) {
        targetId = existing[0].id;
      } else {
        const { data: inserted, error: insertErr } = await admin.from(table).insert(payload).select().single();
        if (insertErr) {
          return NextResponse.json({ error: insertErr.message }, { status: 500 });
        }
        triggerRevalidation();
        return NextResponse.json({ success: true, data: [inserted] });
      }
    }

    if (!targetId) {
      return NextResponse.json({ error: 'Record ID is required for update' }, { status: 400 });
    }

    const { data: updated, error } = await admin.from(table).update(payload).eq('id', targetId).select();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    triggerRevalidation();

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE delete record
export async function DELETE(request: Request) {
  try {
    const { table, id } = await request.json();

    if (!table || !ALLOWED_TABLES.includes(table) || !id) {
      return NextResponse.json({ error: 'Invalid delete payload' }, { status: 400 });
    }

    const admin = createAdminSupabaseClient();
    if (!admin) {
      return NextResponse.json({ success: true, note: 'Local simulation delete' });
    }

    const { error } = await admin.from(table).delete().eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
