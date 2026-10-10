import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

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

    const admin = createAdminSupabaseClient();
    if (!admin) {
      return NextResponse.json({
        success: true,
        data: { ...data, id: `local-${Date.now()}` },
        note: 'Local simulation. To persist permanently, connect Supabase.',
      });
    }

    const { data: inserted, error } = await admin.from(table).insert(data).select().single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

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

    const admin = createAdminSupabaseClient();
    if (!admin) {
      return NextResponse.json({
        success: true,
        data: { ...data, id },
        note: 'Local simulation.',
      });
    }

    let query = admin.from(table).update(data);
    if (id) {
      query = query.eq('id', id);
    }

    const { data: updated, error } = await query.select();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

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
