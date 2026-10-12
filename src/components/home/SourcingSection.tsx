import React from 'react';
import Link from 'next/link';
import type { SourcingPhilosophyData, SourcingPillar } from '@/types';
import { IconRenderer } from '@/components/ui/IconRenderer';

interface SourcingSectionProps {
  data: SourcingPhilosophyData;
  pillars: SourcingPillar[];
}

export function SourcingSection({ data, pillars }: SourcingSectionProps) {
  return (
    <section className="py-20 lg:py-24 bg-[#0b2f1f] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, description, CTA */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {data.heading || 'Our Sourcing Philosophy'}
            </h2>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
              {data.description}
            </p>

            <div className="pt-2">
              <Link
                href={data.cta_url || '/about'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-[#0b2f1f] bg-white hover:bg-emerald-50 transition-all duration-200 shadow-md active:scale-95 group"
              >
                <span>{data.cta_text || 'Read Our Story'}</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Column: Feature Cards */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-5">
              {pillars.map((pillar, index) => (
                <div
                  key={pillar.id}
                  className={`bg-white text-gray-900 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col justify-start ${
                    index >= 2 ? 'hidden sm:flex' : 'flex'
                  }`}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center mb-3 sm:mb-5">
                    <IconRenderer
                      iconUrl={pillar.icon_url}
                      iconName={pillar.icon_name}
                      className="w-5 h-5 sm:w-6 sm:h-6 text-[#15803d]"
                      alt={pillar.title}
                    />
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 sm:mb-2 leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SourcingSection;
