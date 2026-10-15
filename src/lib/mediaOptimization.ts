/**
 * Utilities for video platforms (YouTube, Instagram, Facebook)
 * and media optimization without server/Cloudinary video bandwidth strain.
 */

export type VideoPlatform = 'youtube' | 'instagram' | 'facebook' | 'direct' | 'unknown';

export function detectVideoPlatform(url: string): VideoPlatform {
  if (!url) return 'unknown';
  const clean = url.trim().toLowerCase();
  if (clean.includes('youtube.com') || clean.includes('youtu.be')) return 'youtube';
  if (clean.includes('instagram.com')) return 'instagram';
  if (clean.includes('facebook.com') || clean.includes('fb.watch')) return 'facebook';
  if (clean.startsWith('/uploads/') || /\.(mp4|webm|mov|ogg|mkv)(\?.*)?$/i.test(clean) || clean.includes('cloudinary.com')) {
    return 'direct';
  }
  return 'unknown';
}

export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  // Shorts
  if (url.includes('/shorts/')) {
    const match = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (match?.[1]) return match[1];
  }
  // Standard watch
  if (url.includes('v=')) {
    const match = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (match?.[1]) return match[1];
  }
  // Shortened youtu.be
  if (url.includes('youtu.be/')) {
    const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (match?.[1]) return match[1];
  }
  // Embed
  if (url.includes('/embed/')) {
    const match = url.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function extractInstagramCode(url: string): string | null {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(?:reel|reels|p|tv)\/([a-zA-Z0-9_-]+)/i);
  return match?.[1] || null;
}

export function isDirectVideoFile(url: string): boolean {
  return detectVideoPlatform(url) === 'direct';
}

/**
 * Returns the proper iframe embed URL for YouTube, Instagram Reels, or Facebook Videos.
 */
export function getVideoEmbedUrl(url: string, autoplay = true): string {
  if (!url) return '';
  const platform = detectVideoPlatform(url);

  if (platform === 'youtube') {
    const ytId = extractYoutubeId(url) || 'LXb3EKWsInQ';
    return `https://www.youtube.com/embed/${ytId}?autoplay=${autoplay ? 1 : 0}&rel=0&playsinline=1&controls=1`;
  }

  if (platform === 'instagram') {
    const code = extractInstagramCode(url);
    if (code) {
      return `https://www.instagram.com/reel/${code}/embed/`;
    }
    return url;
  }

  if (platform === 'facebook') {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&autoplay=${autoplay ? 1 : 0}`;
  }

  return url;
}

/**
 * Returns safe video URL.
 */
export function getOptimizedVideoUrl(url: string): string {
  if (!url) return '';
  return url;
}

/**
 * Safely resolves thumbnail URL with fallback to YouTube HQ thumbnail.
 */
export function getOptimizedThumbnailUrl(url: string, videoUrl?: string): string {
  if (url && (url.startsWith('http') || url.startsWith('/'))) {
    return url;
  }
  if (videoUrl) {
    const ytId = extractYoutubeId(videoUrl);
    if (ytId) {
      return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
  }
  return '/images/farm-harvesting.jpg';
}
