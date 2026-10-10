import { NextResponse } from 'next/server';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export async function DELETE(request: Request) {
  try {
    const { publicId, tableName, recordId, fieldName } = await request.json();

    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    const adminSupabase = createAdminSupabaseClient();

    // If connected to Supabase and a record reference is passed, clear DB reference
    if (adminSupabase && tableName && recordId && fieldName) {
      await adminSupabase
        .from(tableName)
        .update({ [fieldName]: null, [`${fieldName.replace('_url', '')}_public_id`]: null })
        .eq('id', recordId);
    }

    // Safely delete from Cloudinary
    let cloudinaryDeleted = false;
    if (process.env.CLOUDINARY_API_SECRET) {
      cloudinaryDeleted = await deleteFromCloudinary(publicId);
    }

    return NextResponse.json({
      success: true,
      cloudinaryDeleted,
      message: 'Asset removed successfully.',
    });
  } catch (error: unknown) {
    console.error('Media deletion error:', error);
    const msg = error instanceof Error ? error.message : 'Deletion failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
