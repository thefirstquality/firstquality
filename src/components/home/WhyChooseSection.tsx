import React from 'react';
import type { WhyChooseItem } from '@/types';
import { IconRenderer } from '@/components/ui/IconRenderer';

interface WhyChooseProps {
  items: WhyChooseItem[];
}

export function WhyChooseSection({ items }: WhyChooseProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#f8faf8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-2xl mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2 sm:mb-2.5">
            Why Choose firstQuality?
          </h2>
          <p className="text-xs sm:text-sm lg:text-[15px] text-gray-600 leading-relaxed font-normal">
            We go beyond just supplying vegetables. Our focus is on building a better, healthier and more sustainable food supply chain with local farmers.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3.5 sm:p-5 rounded-xl border border-gray-200/70 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-start"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 text-[#15803d] flex items-center justify-center mb-2.5 sm:mb-3.5">
                <IconRenderer
                  iconUrl={item.icon_url}
                  iconName={item.icon_name}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[#15803d]"
                  alt={item.title}
                />
              </div>

              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-1.5">
                {item.title}
              </h3>

              <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseSection;
