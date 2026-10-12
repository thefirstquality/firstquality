import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { AboutSectionData, FeatureCard } from '@/types';
import { IconRenderer } from '@/components/ui/IconRenderer';

interface AboutSectionProps {
  data: AboutSectionData;
  features: FeatureCard[];
}

export function AboutSection({ data, features }: AboutSectionProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Image of Farmer */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-gray-100 max-w-md mx-auto lg:max-w-none">
              <Image
                src={data.image_url || '/images/farmer-field.jpg'}
                alt="Kerala farmer tending crops with care"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Column: Text & CTA */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
            <span className="text-[11px] sm:text-xs font-bold tracking-wider text-[#15803d] uppercase">
              {data.badge || 'ABOUT FIRSTQUALITY'}
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {data.heading}
            </h2>

            <p className="text-xs sm:text-sm lg:text-[15px] text-gray-600 leading-relaxed font-normal max-w-xl">
              {data.description}
            </p>

            <div className="pt-1 sm:pt-2">
              <Link
                href={data.cta_url || '/about'}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#15803d] hover:bg-[#166534] transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 group"
              >
                <span>{data.cta_text || 'Know More About Us'}</span>
                <svg
                  className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Feature Cards Below */}
        {features && features.length > 0 && (
          <div className="mt-8 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {features.map((card) => (
              <div
                key={card.id}
                className="p-3.5 sm:p-4 rounded-xl border border-gray-100 bg-[#fbfdfb] hover:bg-white hover:shadow-sm transition-all duration-200 flex flex-col justify-start"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-100/60 text-[#15803d] flex items-center justify-center mb-2.5 sm:mb-3">
                  <IconRenderer
                    iconUrl={card.icon_url}
                    iconName={card.icon_name}
                    className="w-4 h-4 text-[#15803d]"
                    alt={card.title}
                  />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">
                  {card.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AboutSection;
