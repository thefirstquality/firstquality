import React from 'react';
import type { WhyChooseItem } from '@/types';
import { IconRenderer } from '@/components/ui/IconRenderer';

interface WhyChooseProps {
  items: WhyChooseItem[];
}

export function WhyChooseSection({ items }: WhyChooseProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-20 lg:py-24 bg-[#f8faf8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Why Choose firstQuality?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
            We go beyond just supplying vegetables. Our focus is on building a better, healthier and more sustainable food supply chain with local farmers.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-xl border border-gray-200/70 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-start"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center mb-5">
                <IconRenderer
                  iconUrl={item.icon_url}
                  iconName={item.icon_name}
                  className="w-6 h-6 text-[#15803d]"
                  alt={item.title}
                />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
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
