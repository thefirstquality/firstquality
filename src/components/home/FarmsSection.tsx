'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { FarmVideoItem } from '@/types';

interface FarmsSectionProps {
  videos: FarmVideoItem[];
}

function getYoutubeId(url: string): string {
  if (!url) return 'dQw4w9WgXcQ';
  if (url.includes('v=')) {
    return url.split('v=')[1]?.split('&')[0] || 'dQw4w9WgXcQ';
  }
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1]?.split('?')[0] || 'dQw4w9WgXcQ';
  }
  if (url.includes('/embed/')) {
    return url.split('/embed/')[1]?.split('?')[0] || 'dQw4w9WgXcQ';
  }
  return 'dQw4w9WgXcQ';
}

export function FarmsSection({ videos }: FarmsSectionProps) {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  if (!videos || videos.length === 0) return null;

  const featured = videos.find((v) => v.is_featured) || videos[0];
  const sideVideos = videos.filter((v) => v.id !== featured.id).slice(0, 2);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#fbfdfb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title, Accent Line & View All Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4 sm:gap-6">
          <div>
            <span className="text-[11px] sm:text-xs font-bold tracking-wider text-[#15803d] uppercase">
              OUR FARMS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1 mb-2">
              Real Farms. Real People. Real Work.
            </h2>
            <div className="w-12 h-1 bg-[#f97316] rounded-full mb-2.5" />
            <p className="text-xs sm:text-sm lg:text-[15px] text-gray-600 max-w-xl">
              Take a look at our farms, harvesting process and behind-the-scenes moments.
            </p>
          </div>

          <div>
            <Link
              href="/farms"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-[#0d3a22] border border-[#0d3a22]/30 hover:border-[#0d3a22] hover:bg-emerald-50/50 transition-all duration-200 group"
            >
              <span>View More Videos</span>
              <svg
                className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Video Grid: 1 Large on Left, 2 Stacked on Right (Exact Equal Height on Desktop, Same Height on Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          {/* Left Side: 1 Video (Same height as right cards on mobile, full height on desktop) */}
          <div className="lg:col-span-7 h-[230px] sm:h-[260px] lg:h-[490px]">
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-200/80 bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300 group">
              {playingVideoId === featured.id ? (
                /* Inline Muted Player */
                <div className="relative w-full h-full bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeId(
                      featured.video_url
                    )}?autoplay=1&mute=1&playsinline=1&controls=1&rel=0`}
                    title={featured.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-sm text-[11px] font-semibold text-white/90 border border-white/20">
                    <span>🔇 Audio Muted</span>
                  </div>
                  <button
                    onClick={() => setPlayingVideoId(null)}
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center text-xs font-bold transition-all shadow-md"
                    title="Stop Video"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                /* Thumbnail Preview with Play Overlay */
                <div
                  onClick={() => setPlayingVideoId(featured.id)}
                  className="relative w-full h-full cursor-pointer flex flex-col justify-end"
                >
                  <Image
                    src={featured.thumbnail_url || '/images/farm-harvesting.jpg'}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                  />
                  {/* Gradient Overlay for bottom text clarity */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Centered Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-black/50 backdrop-blur-sm border-2 border-white/90 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#15803d]/90 transition-all duration-300 shadow-xl">
                      <svg className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 fill-current ml-0.5 sm:ml-1" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom Video Details */}
                  <div className="relative z-10 p-4 sm:p-5 lg:p-6 text-white flex items-end justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/80 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-white mb-1.5">
                        Featured Farm
                      </div>
                      <h3 className="text-sm sm:text-base lg:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {featured.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] sm:text-[11px] font-medium text-white/80 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-xs border border-white/10">
                        {featured.duration}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-medium text-white/90 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-xs border border-white/10 flex items-center gap-1">
                        🔇 Muted
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: 2 Videos Stacked (Same height as left on mobile, stacked half-height on desktop) */}
          <div className="lg:col-span-5 h-auto lg:h-[490px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-4 sm:gap-5">
            {sideVideos.map((video) => (
              <div
                key={video.id}
                className="relative w-full h-[230px] sm:h-[260px] lg:h-full rounded-2xl overflow-hidden border border-gray-200/80 bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                {playingVideoId === video.id ? (
                  /* Inline Muted Player */
                  <div className="relative w-full h-full bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeId(
                        video.video_url
                      )}?autoplay=1&mute=1&playsinline=1&controls=1&rel=0`}
                      title={video.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <div className="absolute top-2.5 left-2.5 z-20 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-[10px] font-semibold text-white/90 border border-white/20">
                      <span>🔇 Audio Muted</span>
                    </div>
                    <button
                      onClick={() => setPlayingVideoId(null)}
                      className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center text-xs font-bold transition-all shadow-md"
                      title="Stop Video"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  /* Thumbnail Preview */
                  <div
                    onClick={() => setPlayingVideoId(video.id)}
                    className="relative w-full h-full cursor-pointer flex flex-col justify-end"
                  >
                    <Image
                      src={video.thumbnail_url || '/images/farm-tomatoes.jpg'}
                      alt={video.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

                    {/* Centered Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/90 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#15803d]/90 transition-all duration-300 shadow-lg">
                        <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom Details */}
                    <div className="relative z-10 p-4 text-white flex items-end justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-1">
                          {video.title}
                        </h3>
                        <span className="text-[11px] text-white/75 font-medium">
                          {video.duration}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-white/90 px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs border border-white/10 flex-shrink-0">
                        🔇 Muted
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FarmsSection;
