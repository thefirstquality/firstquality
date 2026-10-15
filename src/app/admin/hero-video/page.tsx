'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clapperboard,
  ExternalLink,
  Sprout,
  Check,
  AlertTriangle,
  X,
  Clock,
  Square,
  Save,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { VideoUploadField } from '@/components/admin/VideoUploadField';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import type { HeroSectionData, HeroPopupVideoItem } from '@/types';
import { DEFAULT_HERO, DEFAULT_HERO_POPUP_VIDEOS } from '@/services/defaults';
import {
  parseHeroPopupVideos,
  serializeHeroPopupVideos,
} from '@/services/heroVideoService';
import { extractYoutubeId, isDirectVideoFile, getVideoEmbedUrl } from '@/lib/mediaOptimization';

export default function AdminHeroVideoPage() {
  const [hero, setHero] = useState<HeroSectionData>(DEFAULT_HERO);
  const [buttonLabel, setButtonLabel] = useState<string>('Farm Videos');
  const [videos, setVideos] = useState<HeroPopupVideoItem[]>(DEFAULT_HERO_POPUP_VIDEOS);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live preview player state
  const [previewPlaying, setPreviewPlaying] = useState(false);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/content?table=hero_section');
        const json = await res.json();
        if (json?.data?.[0]) {
          const heroData = json.data[0] as HeroSectionData;
          setHero(heroData);
          setButtonLabel(heroData.secondary_cta_text || 'Farm Videos');

          const parsedVideos = parseHeroPopupVideos(
            heroData.secondary_cta_url,
            heroData.secondary_cta_text || 'From Kerala Farms to Your Table'
          );
          setVideos(parsedVideos);
        }
      } catch (err) {
        console.error('Failed to load hero video data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const currentVideo = videos[activeIndex] || videos[0] || DEFAULT_HERO_POPUP_VIDEOS[0];

  const updateCurrentVideo = (field: keyof HeroPopupVideoItem, value: any) => {
    setPreviewPlaying(false);
    setVideos((prev) => {
      const updated = [...prev];
      if (!updated[activeIndex]) {
        updated[activeIndex] = { ...DEFAULT_HERO_POPUP_VIDEOS[0] };
      }
      updated[activeIndex] = {
        ...updated[activeIndex],
        [field]: value,
      };
      return updated;
    });
  };

  const handleAddVideo = () => {
    const newVid: HeroPopupVideoItem = {
      id: `hv-${Date.now()}`,
      title: 'New Farm Video Clip',
      duration: '0:45',
      video_url: '',
      thumbnail_url: '/images/farm-harvesting.jpg',
      description: 'Behind the scenes at our partnered farms.',
    };
    setVideos((prev) => [...prev, newVid]);
    setActiveIndex(videos.length);
    setPreviewPlaying(false);
  };

  const handleRemoveVideo = (indexToRemove: number) => {
    if (videos.length <= 1) {
      alert('You must have at least one video for the hero popup.');
      return;
    }
    setVideos((prev) => prev.filter((_, i) => i !== indexToRemove));
    if (activeIndex >= indexToRemove && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
    setPreviewPlaying(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setErrorMessage(null);

    // Validate that primary video has a source
    if (!videos[0]?.video_url) {
      setErrorMessage('Please provide a video source (YouTube URL or uploaded video) for the primary video.');
      setSaving(false);
      return;
    }

    try {
      const serializedVideoData = serializeHeroPopupVideos(videos);

      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'hero_section',
          id: hero.id,
          data: {
            ...hero,
            secondary_cta_text: buttonLabel.trim() || 'Farm Videos',
            secondary_cta_url: serializedVideoData,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to save hero popup video');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving hero popup video';
      setErrorMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  const isDirect = isDirectVideoFile(currentVideo?.video_url || '');
  const ytId = extractYoutubeId(currentVideo?.video_url || '');

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
              <Link href="/admin/hero" className="hover:underline">
                Hero Section
              </Link>
              <span>/</span>
              <span>Popup Video</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2.5">
              <Clapperboard className="w-6 h-6 text-[#15803d]" />
              <span>Hero Banner Popup Video</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Configure the dedicated video that opens in a popup when users click the <strong>&ldquo;{buttonLabel}&rdquo;</strong> button in the hero banner.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live Site</span>
            </Link>
            <Link
              href="/admin/farms"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-800 transition"
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Farm Section Videos &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Hero Banner Popup Video saved successfully! Changes are live on the homepage hero button.</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading Hero Video Configuration...
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. Hero Button Configuration Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-gray-900">
                    Hero Banner Button Settings
                  </h2>
                  <p className="text-xs text-gray-500">
                    Customize the button on the hero banner that triggers this popup.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                  Popup Trigger
                </span>
              </div>

              <div className="max-w-md">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Button Text Label
                </label>
                <input
                  type="text"
                  value={buttonLabel}
                  onChange={(e) => setButtonLabel(e.target.value)}
                  placeholder="e.g. Farm Videos, Watch Farm Story"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                  required
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Clicking this button on the hero banner will open your configured popup video.
                </p>
              </div>
            </div>

            {/* 2. Video Clips List (if multiple) */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-gray-900">
                    Hero Popup Videos ({videos.length})
                  </h2>
                  <p className="text-xs text-gray-500">
                    Manage the main video and optional extra clips showcased in the Hero popup modal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddVideo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition active:scale-95 cursor-pointer self-start sm:self-auto"
                >
                  <span>+</span> Add Another Video Clip
                </button>
              </div>

              {/* Video Tabs / Playlist Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {videos.map((vid, idx) => (
                  <button
                    key={vid.id || idx}
                    type="button"
                    onClick={() => {
                      setActiveIndex(idx);
                      setPreviewPlaying(false);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer border ${
                      idx === activeIndex
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>{idx === 0 ? '⭐ Primary' : `#${idx + 1}`}</span>
                    <span className="truncate max-w-[120px]">{vid.title || 'Untitled'}</span>
                    {videos.length > 1 && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveVideo(idx);
                        }}
                        className="hover:text-red-600 ml-1 p-0.5 rounded"
                        title="Remove video clip"
                      >
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Video Form Fields & Live Preview Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                {/* Left 7 Columns: Video Settings */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Video Title
                    </label>
                    <input
                      type="text"
                      value={currentVideo.title || ''}
                      onChange={(e) => updateCurrentVideo('title', e.target.value)}
                      placeholder="e.g. From Kerala Farms to Your Table"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Video Duration
                      </label>
                      <input
                        type="text"
                        value={currentVideo.duration || '1:00'}
                        onChange={(e) => updateCurrentVideo('duration', e.target.value)}
                        placeholder="e.g. 1:00 or 0:45"
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Short Description / Subtitle
                      </label>
                      <input
                        type="text"
                        value={currentVideo.description || ''}
                        onChange={(e) => updateCurrentVideo('description', e.target.value)}
                        placeholder="e.g. Watch how our harvest is handled"
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                      />
                    </div>
                  </div>

                  {/* Video Source */}
                  <VideoUploadField
                    label="Video Link (YouTube, Instagram Reel, or Facebook)"
                    value={currentVideo.video_url || ''}
                    onChange={(url) => updateCurrentVideo('video_url', url)}
                    onThumbnailSuggest={(thumb) => {
                      if (!currentVideo.thumbnail_url || currentVideo.thumbnail_url.includes('img.youtube.com') || currentVideo.thumbnail_url.includes('/images/')) {
                        updateCurrentVideo('thumbnail_url', thumb);
                      }
                    }}
                  />

                  {/* Video Poster Thumbnail */}
                  <ImageUploadField
                    label="Poster Thumbnail Image (Shown before user clicks Play)"
                    value={currentVideo.thumbnail_url || ''}
                    onChange={(url, publicId) => {
                      updateCurrentVideo('thumbnail_url', url);
                      updateCurrentVideo('thumbnail_public_id', publicId);
                    }}
                    folder="firstquality/hero-thumbnails"
                  />
                </div>

                {/* Right 5 Columns: Live Modal Preview */}
                <div className="lg:col-span-5">
                  <div className="sticky top-20 bg-[#09120e] rounded-2xl border border-emerald-500/30 p-4 text-white shadow-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-xs">
                          <Clapperboard className="w-3.5 h-3.5 text-emerald-400" />
                        </span>
                        <div>
                          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                            Hero Popup Preview
                          </p>
                          <h4 className="text-xs font-bold text-white truncate max-w-[180px]">
                            {currentVideo.title || 'Untitled Video'}
                          </h4>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">
                        Live Preview
                      </span>
                    </div>

                    {/* Preview Player Box */}
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10">
                      {previewPlaying ? (
                        currentVideo.video_url ? (
                          isDirect ? (
                            <video
                              src={currentVideo.video_url}
                              controls
                              autoPlay
                              playsInline
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <iframe
                              src={getVideoEmbedUrl(currentVideo.video_url, true)}
                              title={currentVideo.title}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            />
                          )
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs text-gray-400">
                            Please provide a video URL
                          </div>
                        )
                      ) : (
                        <div className="relative w-full h-full group/preview">
                          <Image
                            src={currentVideo.thumbnail_url || '/images/hero-farm-produce.jpg'}
                            alt={currentVideo.title || 'Preview'}
                            fill
                            sizes="320px"
                            className="object-cover opacity-85"
                            unoptimized={
                              currentVideo.thumbnail_url?.startsWith('/images/') ||
                              currentVideo.thumbnail_url?.includes('img.youtube.com')
                            }
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                          {currentVideo.duration && (
                            <span className="inline-flex items-center gap-1 absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-semibold text-white/90">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{currentVideo.duration}</span>
                            </span>
                          )}

                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-3">
                            <button
                              type="button"
                              onClick={() => setPreviewPlaying(true)}
                              className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition active:scale-95 cursor-pointer border-2 border-white/80"
                              title="Test Play in Preview"
                            >
                              <svg className="w-5 h-5 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </button>
                            <span className="text-[10px] text-gray-300 font-medium">
                              Click to test play
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {previewPlaying && (
                      <button
                        type="button"
                        onClick={() => setPreviewPlaying(false)}
                        className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-gray-300 transition text-center cursor-pointer"
                      >
                        <Square className="w-3 h-3 fill-current" />
                        <span>Stop & Return to Preview</span>
                      </button>
                    )}

                    <div className="text-[11px] text-gray-400 border-t border-white/5 pt-2">
                      <p className="line-clamp-2">
                        {currentVideo.description || 'Watch how firstQuality sources fresh produce directly from farmers.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Buttons Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/admin/hero"
                className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-xs sm:text-sm font-semibold text-gray-700 transition"
              >
                Back to Hero Settings
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-[#15803d] hover:bg-[#0e3d23] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Hero Popup Video</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
