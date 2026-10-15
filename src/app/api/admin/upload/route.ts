import { NextResponse } from 'next/server';
import { uploadToCloudinary, MAX_IMAGE_SIZE_BYTES, MAX_VIDEO_SIZE_BYTES } from '@/lib/cloudinary';
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

    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|ogg|mkv)$/i.test(file.name);
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(file.name);

    if (isVideo) {
      return NextResponse.json(
        { error: 'Direct video file uploads are disabled to save server and Cloudinary storage/bandwidth. Please link videos using YouTube, Instagram Reels, or Facebook.' },
        { status: 400 }
      );
    }

    if (!isImage) {
      return NextResponse.json(
        { error: 'Invalid file format. Only image files (JPG, PNG, WEBP, SVG) are supported.' },
        { status: 400 }
      );
    }

    // Size validation
    const maxAllowedSize = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
    if (file.size > maxAllowedSize) {
      const maxMb = Math.round(maxAllowedSize / (1024 * 1024));
      return NextResponse.json(
        { error: `File size exceeds maximum allowed limit of ${maxMb} MB. Please compress or select a smaller file.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If Cloudinary credentials configured, upload to Cloudinary
    if (process.env.CLOUDINARY_API_SECRET) {
      const result = await uploadToCloudinary(buffer, folder, undefined, isVideo ? 'video' : 'image');
      return NextResponse.json({
        success: true,
        url: result.url,
        public_id: result.publicId,
        size: file.size,
        is_video: isVideo,
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
      is_video: isVideo,
      note: 'Saved locally.',
    });
  } catch (error: unknown) {
    console.error('Upload handler error:', error);
    const msg = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
