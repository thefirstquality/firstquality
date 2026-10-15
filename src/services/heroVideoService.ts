import type { HeroPopupVideoItem } from '@/types';
import { DEFAULT_HERO_POPUP_VIDEOS } from '@/services/defaults';
import { extractYoutubeId } from '@/lib/mediaOptimization';

/**
 * Parses secondary_cta_url from hero_section into a clean list of HeroPopupVideoItem.
 * Supports:
 * - JSON string containing video details
 * - Plain video URL (YouTube, Cloudinary, or local upload)
 * - Empty or legacy #farms fallback to DEFAULT_HERO_POPUP_VIDEOS
 */
export function parseHeroPopupVideos(
  secondaryCtaUrl?: string | null,
  fallbackTitle = 'From Kerala Farms to Your Table'
): HeroPopupVideoItem[] {
  if (!secondaryCtaUrl || secondaryCtaUrl === '#farms' || secondaryCtaUrl === '#videos') {
    return DEFAULT_HERO_POPUP_VIDEOS;
  }

  // Try JSON parse first
  try {
    if (secondaryCtaUrl.trim().startsWith('{') || secondaryCtaUrl.trim().startsWith('[')) {
      const parsed = JSON.parse(secondaryCtaUrl);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((v, i) => ({
          id: v.id || `hv-${i + 1}`,
          title: v.title || fallbackTitle,
          duration: v.duration || '1:00',
          video_url: v.video_url || v.url || '',
          thumbnail_url: v.thumbnail_url || '/images/hero-farm-produce.jpg',
          thumbnail_public_id: v.thumbnail_public_id,
          description: v.description,
        }));
      }
      if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.videos) && parsed.videos.length > 0) {
          return parsed.videos.map((v: HeroPopupVideoItem, i: number) => ({
            id: v.id || `hv-${i + 1}`,
            title: v.title || fallbackTitle,
            duration: v.duration || '1:00',
            video_url: v.video_url || '',
            thumbnail_url: v.thumbnail_url || '/images/hero-farm-produce.jpg',
            thumbnail_public_id: v.thumbnail_public_id,
            description: v.description,
          }));
        }
        if (parsed.video_url || parsed.url) {
          return [
            {
              id: 'hv-1',
              title: parsed.title || fallbackTitle,
              duration: parsed.duration || '1:00',
              video_url: parsed.video_url || parsed.url,
              thumbnail_url: parsed.thumbnail_url || '/images/hero-farm-produce.jpg',
              thumbnail_public_id: parsed.thumbnail_public_id,
              description: parsed.description,
            },
          ];
        }
      }
    }
  } catch {
    // Not valid JSON, continue to plain URL parsing
  }

  // Plain video URL
  if (
    secondaryCtaUrl.startsWith('http') ||
    secondaryCtaUrl.startsWith('/uploads/') ||
    secondaryCtaUrl.includes('youtu') ||
    secondaryCtaUrl.includes('cloudinary')
  ) {
    let thumb = '/images/hero-farm-produce.jpg';
    const ytId = extractYoutubeId(secondaryCtaUrl);
    if (ytId && ytId !== 'dQw4w9WgXcQ') {
      thumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }

    return [
      {
        id: 'hv-1',
        title: fallbackTitle,
        duration: '1:00',
        video_url: secondaryCtaUrl,
        thumbnail_url: thumb,
        description: 'Watch how firstQuality harvests and delivers fresh produce.',
      },
    ];
  }

  return DEFAULT_HERO_POPUP_VIDEOS;
}

/**
 * Serializes hero popup video array into JSON string stored in hero_section.secondary_cta_url.
 */
export function serializeHeroPopupVideos(videos: HeroPopupVideoItem[]): string {
  if (!videos || videos.length === 0) {
    return JSON.stringify({
      type: 'hero_popup_video',
      videos: DEFAULT_HERO_POPUP_VIDEOS,
    });
  }

  return JSON.stringify({
    type: 'hero_popup_video',
    videos,
  });
}
