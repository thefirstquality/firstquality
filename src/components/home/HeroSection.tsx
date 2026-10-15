'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { HeroSectionData, HeroBenefit, HeroPopupVideoItem } from '@/types';
import { HeroBenefits } from '@/components/home/HeroBenefits';
import { FarmVideoModal } from '@/components/home/FarmVideoModal';
import { parseHeroPopupVideos } from '@/services/heroVideoService';

interface HeroSectionProps {
  data: HeroSectionData;
  benefits: HeroBenefit[];
  heroVideos?: HeroPopupVideoItem[];
}

export function HeroSection({ data, benefits, heroVideos }: HeroSectionProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Dedicated hero popup videos configured separately by admin
  const popupVideos =
    heroVideos && heroVideos.length > 0
      ? heroVideos
      : parseHeroPopupVideos(data.secondary_cta_url, data.secondary_cta_text);

  // Check if secondary button should act as the Hero Video popup trigger
  const isVideoAction =
    !data.secondary_cta_url ||
    data.secondary_cta_url === '#farms' ||
    data.secondary_cta_url === '#videos' ||
    data.secondary_cta_url === '#farm-videos' ||
    data.secondary_cta_url === '/farms' ||
    data.secondary_cta_url.trim().startsWith('{') ||
    data.secondary_cta_url.includes('youtu') ||
    data.secondary_cta_url.includes('cloudinary') ||
    data.secondary_cta_url.startsWith('/uploads/') ||
    (data.secondary_cta_text && /video/i.test(data.secondary_cta_text));

  const secondaryButtonLabel =
    data.secondary_cta_text && data.secondary_cta_text !== 'Business Enquiry'
      ? data.secondary_cta_text
      : 'Farm Videos';

  return (
    <section className="relative min-h-[100svh] sm:min-h-[90vh] lg:min-h-[92vh] flex flex-col justify-end sm:justify-between pt-20 sm:pt-32 lg:pt-36 pb-8 sm:pb-10 lg:pb-12 overflow-hidden bg-gray-100">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={data.background_image_url || '/images/hero-farm-produce.jpg'}
          alt="Fresh farm produce crate in Kerala field"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center sm:object-right md:object-center"
        />
        {/* Desktop gradient: left-to-right covering content area */}
        <div className="hidden md:block absolute inset-y-0 left-0 w-full md:w-3/5 lg:w-1/2 bg-gradient-to-r from-white via-white/95 to-transparent pointer-events-none" />
        {/* Mobile/Tablet gradient: bottom-to-top dark scrim for bottom-left content */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 pointer-events-none" />
      </div>

      {/* Main Content Container - bottom-left on mobile */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-auto mb-2 sm:my-auto py-2 sm:py-6">
        <div className="max-w-xl lg:max-w-lg space-y-3 sm:space-y-4 text-left">
          {/* Badge - hidden on mobile */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/90 border border-emerald-200/60 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803d]" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#15803d] uppercase">
              {data.badge || 'FRESH VEGETABLES, BETTER LIVING.'}
            </span>
          </div>

          {/* Heading - 2 lines on mobile & desktop */}
          <h1 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-white sm:text-gray-900 leading-[1.2] sm:leading-[1.16]">
            <span>{data.headline_line1} {data.headline_line2}</span>
            <br />
            <span className="text-[#22c55e] sm:text-[#15803d]">{data.headline_highlight}</span>
          </h1>

          {/* Supporting Description - white on mobile */}
          <p className="text-xs sm:text-sm lg:text-[15px] text-white/95 sm:text-gray-600 leading-relaxed font-normal max-w-lg drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] sm:drop-shadow-none">
            {data.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-row flex-nowrap items-center gap-2 sm:gap-3 pt-2 sm:pt-3">
            <Link
              href={data.primary_cta_url || '/products'}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#0e3d23] hover:bg-[#15803d] transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 group text-center min-h-[40px] sm:min-h-[50px] flex-1 sm:flex-none whitespace-nowrap cursor-pointer"
            >
              <span>{data.primary_cta_text || 'Explore Our Products'}</span>
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            {isVideoAction ? (
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2.5 px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-lg text-xs sm:text-sm font-semibold text-[#0e3d23] bg-white border border-[#0e3d23]/40 hover:border-[#0e3d23] hover:bg-emerald-50/50 transition-all duration-200 shadow-sm hover:shadow active:scale-95 text-center min-h-[40px] sm:min-h-[50px] group flex-1 sm:flex-none whitespace-nowrap cursor-pointer"
              >
                <svg
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#15803d] group-hover:scale-110 transition-transform flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path
                    d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"
                    fill="currentColor"
                  />
                  <rect x="2" y="6" width="14" height="12" rx="2" />
                  <polygon points="7 9 11 12 7 15 7 9" fill="currentColor" stroke="none" />
                </svg>
                <span>{secondaryButtonLabel}</span>
              </button>
            ) : (
              <Link
                href={data.secondary_cta_url || '#farms'}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2.5 px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-lg text-xs sm:text-sm font-semibold text-[#0e3d23] bg-white border border-[#0e3d23]/40 hover:border-[#0e3d23] hover:bg-emerald-50/50 transition-all duration-200 shadow-sm hover:shadow active:scale-95 text-center min-h-[40px] sm:min-h-[50px] group flex-1 sm:flex-none whitespace-nowrap cursor-pointer"
              >
                <svg
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#15803d] group-hover:scale-110 transition-transform flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path
                    d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"
                    fill="currentColor"
                  />
                  <rect x="2" y="6" width="14" height="12" rx="2" />
                  <polygon points="7 9 11 12 7 15 7 9" fill="currentColor" stroke="none" />
                </svg>
                <span>{secondaryButtonLabel}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Floating 4-Column Benefit Highlights Bar - hidden on mobile view */}
      <div className="hidden sm:block relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6 sm:mt-8">
        <HeroBenefits benefits={benefits} />
      </div>

      {/* Popup Video Modal with Separate Hero Banner Videos */}
      <FarmVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videos={popupVideos}
        badgeTitle="Hero Farm Video"
      />
    </section>
  );
}

export default HeroSection;
