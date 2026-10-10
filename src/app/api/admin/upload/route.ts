import { NextResponse } from 'next/server';
import { uploadToCloudinary, MAX_FILE_SIZE_BYTES } from '@/lib/cloudinary';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'firstquality';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Size validation: Strict 4 MB max
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed limit of 4 MB. Please compress the file before uploading.' },
        { status: 400 }
      );
    }

    // MIME type validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Only JPG, PNG, WEBP, and SVG files are supported.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If Cloudinary credentials configured, upload to Cloudinary
    if (process.env.CLOUDINARY_API_SECRET) {
      const result = await uploadToCloudinary(buffer, folder);
      return NextResponse.json({
        success: true,
        url: result.url,
        public_id: result.publicId,
        size: file.size,
      });
    }

    // Fallback local storage for local development
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const sanitizedName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, sanitizedName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${sanitizedName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      public_id: sanitizedName,
      size: file.size,
      note: 'Saved locally. Configure Cloudinary credentials in .env to upload to Cloudinary CDN.',
    });
  } catch (error: unknown) {
    console.error('Upload handler error:', error);
    const msg = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
