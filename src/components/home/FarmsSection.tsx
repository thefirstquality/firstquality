'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { FarmVideoItem } from '@/types';

interface FarmsSectionProps {
  videos: FarmVideoItem[];
}

export function FarmsSection({ videos }: FarmsSectionProps) {
  const [activeVideo, setActiveVideo] = useState<FarmVideoItem | null>(null);

  if (!videos || videos.length === 0) return null;

  const featured = videos.find((v) => v.is_featured) || videos[0];
  const sideVideos = videos.filter((v) => v.id !== featured.id).slice(0, 2);

  return (
    <section className="py-20 lg:py-24 bg-[#fbfdfb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title, Accent Line & View All Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
              OUR FARMS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-1 mb-3">
              Real Farms. Real People. Real Work.
            </h2>
            <div className="w-14 h-1 bg-[#f97316] rounded-full mb-3" />
            <p className="text-sm sm:text-base text-gray-600 max-w-xl">
              Take a look at our farms, harvesting process and behind-the-scenes moments.
            </p>
          </div>

          <div>
            <Link
              href="/farms"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-[#0d3a22] border border-[#0d3a22]/40 hover:border-[#0d3a22] hover:bg-emerald-50/50 transition-all duration-200 group"
            >
              <span>View More Videos</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Video Cards Grid matching Reference 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Large Featured Video (8 cols on lg) */}
          <div className="lg:col-span-7">
            <div
              onClick={() => setActiveVideo(featured)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-900">
                <Image
                  src={featured.thumbnail_url || '/images/farm-harvesting.jpg'}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/60 backdrop-blur-sm border-2 border-white/80 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#15803d]/90 transition-all duration-300 shadow-2xl">
                    <svg className="w-8 h-8 sm:w-9 sm:h-9 fill-current ml-1" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#15803d] transition-colors">
                    {featured.title}
                  </h3>
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">
                    {featured.duration}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2 Smaller Video Cards (5 cols on lg) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {sideVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-900">
                  <Image
                    src={video.thumbnail_url || '/images/farm-tomatoes.jpg'}
                    alt={video.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/80 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#15803d]/90 transition-all duration-300 shadow-lg">
                      <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#15803d] transition-colors">
                      {video.title}
                    </h3>
                    <span className="text-xs text-gray-500 font-medium">
                      {video.duration}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Lightbox Modal */}
        {activeVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
            onClick={() => setActiveVideo(null)}
          >
            <div
              className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors"
                aria-label="Close video"
              >
                ✕
              </button>

              <iframe
                src={`https://www.youtube.com/embed/${
                  activeVideo.video_url.includes('v=')
                    ? activeVideo.video_url.split('v=')[1]?.split('&')[0]
                    : 'dQw4w9WgXcQ'
                }?autoplay=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FarmsSection;
