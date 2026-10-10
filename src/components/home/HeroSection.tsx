import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { HeroSectionData, HeroBenefit } from '@/types';
import { HeroBenefits } from '@/components/home/HeroBenefits';

interface HeroSectionProps {
  data: HeroSectionData;
  benefits: HeroBenefit[];
}

export function HeroSection({ data, benefits }: HeroSectionProps) {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-32 sm:pt-36 pb-12 overflow-hidden bg-gradient-to-b from-[#e8f5ec] via-[#f4faf5] to-white">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={data.background_image_url || '/images/hero-farm-produce.jpg'}
          alt="Fresh farm produce crate in Kerala field"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right md:object-center opacity-90 sm:opacity-95"
        />
        {/* Soft gradient overlay to ensure text contrast on left while keeping right image vivid */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent sm:via-white/70 sm:to-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-8">
        <div className="max-w-2xl lg:max-w-xl space-y-6">
          {/* Badge */}
          <div className="inline-block">
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
              {data.badge || 'FRESH VEGETABLES, BETTER LIVING.'}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.12]">
            <span>{data.headline_line1} </span>
            <br />
            <span>{data.headline_line2} </span>
            <br />
            <span className="text-[#15803d]">{data.headline_highlight}</span>
          </h1>

          {/* Supporting Description */}
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal max-w-xl">
            {data.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={data.primary_cta_url || '/products'}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg text-sm font-semibold text-white bg-[#0e3d23] hover:bg-[#15803d] transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 group"
            >
              <span>{data.primary_cta_text || 'Explore Our Products'}</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href={data.secondary_cta_url || '/enquiry'}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg text-sm font-semibold text-[#0e3d23] bg-white border border-[#0e3d23]/40 hover:border-[#0e3d23] hover:bg-gray-50 transition-all duration-200 shadow-sm active:scale-95"
            >
              {data.secondary_cta_text || 'Business Enquiry'}
            </Link>
          </div>
        </div>
      </div>

      {/* Floating 4-Column Benefit Highlights Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8">
        <HeroBenefits benefits={benefits} />
      </div>
    </section>
  );
}

export default HeroSection;
