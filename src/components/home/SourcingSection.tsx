import React from 'react';
import Link from 'next/link';
import type { SourcingPhilosophyData, SourcingPillar } from '@/types';
import { IconRenderer } from '@/components/ui/IconRenderer';

// In-code static data - built directly into code without admin-side management
export const SOURCING_PHILOSOPHY_STATIC: SourcingPhilosophyData = {
  heading: 'Our Sourcing Philosophy',
  description:
    'We believe in practical quality, real safety and strong farmer relationships. Instead of marketing buzzwords, we focus on direct sourcing, field supervision and sustainable farming practices.',
  cta_text: 'Read Our Story',
  cta_url: '/about',
  is_published: true,
};

export const SOURCING_PILLARS_STATIC: SourcingPillar[] = [
  {
    id: '1',
    title: 'Field Staff Supervised',
    description: 'Our team visits fields to inspect and select only prime produce.',
    icon_name: 'user-check',
    sort_order: 1,
  },
  {
    id: '2',
    title: 'Good Farming Practices',
    description: 'We guide farmers towards safe, clean and sustainable cultivation.',
    icon_name: 'leaf',
    sort_order: 2,
  },
  {
    id: '3',
    title: 'Direct Farmer Partnership',
    description: 'Empowering local growers with technical advisory and direct market access.',
    icon_name: 'handshake',
    sort_order: 3,
  },
];

interface SourcingSectionProps {
  data?: SourcingPhilosophyData;
  pillars?: SourcingPillar[];
}

export function SourcingSection({
  data = SOURCING_PHILOSOPHY_STATIC,
  pillars = SOURCING_PILLARS_STATIC,
}: SourcingSectionProps) {
  const content = data || SOURCING_PHILOSOPHY_STATIC;
  const pillarList = pillars && pillars.length > 0 ? pillars : SOURCING_PILLARS_STATIC;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#0b2f1f] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, description, CTA */}
          <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {content.heading || 'Our Sourcing Philosophy'}
            </h2>

            <p className="text-xs sm:text-sm lg:text-[15px] text-emerald-100/85 leading-relaxed font-normal max-w-lg">
              {content.description}
            </p>

            <div className="pt-1 sm:pt-2">
              <Link
                href={content.cta_url || '/about'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-[#0b2f1f] bg-white hover:bg-emerald-50 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 group"
              >
                <span>{content.cta_text || 'Read Our Story'}</span>
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

          {/* Right Column: Feature Cards */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {pillarList.map((pillar, index) => (
                <div
                  key={pillar.id}
                  className={`bg-white text-gray-900 rounded-xl p-3.5 sm:p-4.5 shadow-lg flex flex-col justify-start ${
                    index >= 2 ? 'hidden sm:flex' : 'flex'
                  }`}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 text-[#15803d] flex items-center justify-center mb-2.5 sm:mb-3.5">
                    <IconRenderer
                      iconUrl={pillar.icon_url}
                      iconName={pillar.icon_name}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#15803d]"
                      alt={pillar.title}
                    />
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 sm:mb-1.5 leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
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
