import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary server-side
if (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_SIZE_BYTES = 60 * 1024 * 1024; // 60 MB
export const MAX_FILE_SIZE_BYTES = MAX_VIDEO_SIZE_BYTES;
export const COMPRESSION_THRESHOLD_BYTES = 2 * 1024 * 1024; // 2 MB

export interface UploadResult {
  url: string;
  publicId: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}

/**
 * Upload image or video buffer to Cloudinary
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder = 'firstquality',
  customPublicId?: string,
  resourceType: 'image' | 'video' | 'auto' = 'auto'
): Promise<UploadResult> {
  if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials are not configured on the server.');
  }

  const maxSize = resourceType === 'image' ? MAX_IMAGE_SIZE_BYTES : MAX_VIDEO_SIZE_BYTES;
  if (buffer.length > maxSize) {
    throw new Error(`File exceeds the maximum allowed size of ${Math.round(maxSize / (1024 * 1024))} MB.`);
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: customPublicId,
        resource_type: resourceType,
        ...(resourceType === 'image'
          ? {
              transformation: [
                { quality: 'auto:good' },
                { fetch_format: 'auto' },
              ],
            }
          : {
              transformation: [
                { quality: 'auto:eco' },
                { width: 1280, crop: 'limit' },
              ],
            }),
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed with no result'));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete asset from Cloudinary by public ID
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!process.env.CLOUDINARY_API_SECRET) {
    console.warn('Cannot delete from Cloudinary: server credentials missing.');
    return false;
  }

  if (!publicId) {
    return false;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
    return result.result === 'ok';
  } catch (error) {
    console.error('Failed to delete asset from Cloudinary:', error);
    return false;
  }
}

/**
 * Generate optimized Cloudinary URL with responsive transformations
 */
export function getOptimizedImageUrl(url: string, width = 800): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com')) return url;

  // Insert transformation after /upload/
  return url.replace('/upload/', `/upload/c_limit,w_${width},f_auto,q_auto/`);
}
