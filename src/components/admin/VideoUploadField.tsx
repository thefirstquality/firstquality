'use client';

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Globe,
  Video,
  Camera,
  Share2,
  X,
  AlertTriangle,
  Info,
  Play,
} from 'lucide-react';
import {
  detectVideoPlatform,
  extractYoutubeId,
  extractInstagramCode,
  getVideoEmbedUrl,
  VideoPlatform,
} from '@/lib/mediaOptimization';

interface VideoUploadFieldProps {
  label?: string;
  value?: string;
  onChange: (videoUrl: string) => void;
  onThumbnailSuggest?: (thumbnailUrl: string) => void;
  folder?: string;
  className?: string;
}

export { extractYoutubeId, extractInstagramCode, detectVideoPlatform };

export function isDirectVideoFile(url: string): boolean {
  return false; // Direct video files disabled
}

export function VideoUploadField({
  label = 'Video Link (YouTube, Instagram, or Facebook)',
  value = '',
  onChange,
  onThumbnailSuggest,
  className = '',
}: VideoUploadFieldProps) {
  const [inputUrl, setInputUrl] = useState<string>(value || '');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'youtube' | 'instagram' | 'facebook'>('all');
  const [showPreview, setShowPreview] = useState(false);

  // Sync external value
  useEffect(() => {
    setInputUrl(value || '');
  }, [value]);

  const platform = detectVideoPlatform(inputUrl);

  const handleUrlChange = (val: string) => {
    setInputUrl(val);
    onChange(val.trim());

    // Auto-suggest YouTube thumbnail
    if (onThumbnailSuggest) {
      const ytId = extractYoutubeId(val.trim());
      if (ytId) {
        onThumbnailSuggest(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
      }
    }
  };

  const getPlatformDetails = () => {
    switch (platform) {
      case 'youtube':
        return {
          name: 'YouTube Video / Short',
          icon: Video,
          badgeClass: 'bg-red-50 text-red-700 border-red-200',
          hint: 'Detected valid YouTube link',
        };
      case 'instagram':
        return {
          name: 'Instagram Reel / Post',
          icon: Camera,
          badgeClass: 'bg-pink-50 text-pink-700 border-pink-200',
          hint: 'Detected valid Instagram Reel link',
        };
      case 'facebook':
        return {
          name: 'Facebook Video / Reel',
          icon: Share2,
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
          hint: 'Detected valid Facebook video link',
        };
      default:
        return null;
    }
  };

  const platformDetails = getPlatformDetails();
  const PlatformIcon = platformDetails?.icon;
  const embedUrl = getVideoEmbedUrl(inputUrl, false);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          {label}
        </label>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <Zap className="w-3 h-3 text-emerald-600" />
          <span>Free-Tier Safe (No Direct Uploads)</span>
        </span>
      </div>

      {/* Platform Tabs Selector */}
      <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl">
        <button
          type="button"
          onClick={() => setSelectedPlatform('all')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedPlatform === 'all'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Any Link</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedPlatform('youtube')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedPlatform === 'youtube'
              ? 'bg-white text-red-600 shadow-xs'
              : 'text-gray-500 hover:text-red-600'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>YouTube</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedPlatform('instagram')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedPlatform === 'instagram'
              ? 'bg-white text-pink-600 shadow-xs'
              : 'text-gray-500 hover:text-pink-600'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Instagram</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedPlatform('facebook')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedPlatform === 'facebook'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Facebook</span>
        </button>
      </div>

      {/* Input Box */}
      <div className="relative">
        <input
          type="url"
          value={inputUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={
            selectedPlatform === 'youtube'
              ? 'Paste YouTube URL (e.g. https://www.youtube.com/watch?v=... or /shorts/...)'
              : selectedPlatform === 'instagram'
              ? 'Paste Instagram Reel URL (e.g. https://www.instagram.com/reel/...)'
              : selectedPlatform === 'facebook'
              ? 'Paste Facebook Video URL (e.g. https://www.facebook.com/.../videos/... or /reel/...)'
              : 'Paste YouTube, Instagram Reel, or Facebook Video URL'
          }
          className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d] bg-white transition"
          required
        />
        {inputUrl && (
          <button
            type="button"
            onClick={() => handleUrlChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            title="Clear"
            aria-label="Clear video URL"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Detected Platform Badge & Help */}
      {platformDetails && PlatformIcon ? (
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${platformDetails.badgeClass}`}>
              <PlatformIcon className="w-3 h-3" />
              <span>{platformDetails.name}</span>
            </span>
            <span className="text-gray-600 text-[11px]">
              {platformDetails.hint}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
          >
            {showPreview ? 'Hide Embed Preview' : 'Show Embed Preview'}
          </button>
        </div>
      ) : inputUrl ? (
        <p className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Please ensure the URL is from <strong>YouTube</strong>, <strong>Instagram</strong>, or <strong>Facebook</strong>.</span>
        </p>
      ) : (
        <p className="text-[11px] text-gray-400 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 mt-0.5 text-gray-400 flex-shrink-0" />
          <span>Paste a public link from <strong>YouTube (Videos or Shorts)</strong>, <strong>Instagram (Reels or Posts)</strong>, or <strong>Facebook (Videos or Reels)</strong>. Direct video uploads are disabled to save server storage and bandwidth.</span>
        </p>
      )}

      {/* Live Embed Preview */}
      {showPreview && embedUrl && (
        <div className="mt-3 p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span className="font-bold flex items-center gap-1.5">
              {PlatformIcon && <PlatformIcon className="w-3.5 h-3.5" />}
              <span>Live Player Embed Preview</span>
            </span>
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="inline-flex items-center gap-1 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
          </div>
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black border border-white/10">
            <iframe
              src={embedUrl}
              title="Video Preview"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoUploadField;
