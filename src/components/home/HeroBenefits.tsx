import React from 'react';
import type { HeroBenefit } from '@/types';
import { IconRenderer } from '@/components/ui/IconRenderer';

interface HeroBenefitsProps {
  benefits: HeroBenefit[];
}

export function HeroBenefits({ benefits }: HeroBenefitsProps) {
  if (!benefits || benefits.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 backdrop-blur-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
        {benefits.map((item, index) => (
          <div
            key={item.id || index}
            className={`flex items-center gap-4 ${
              index > 0 ? 'sm:pl-6 pt-4 sm:pt-0' : ''
            }`}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center">
              <IconRenderer
                iconUrl={item.icon_url}
                iconName={item.icon_name}
                className="w-6 h-6 text-[#15803d]"
                alt={item.title}
              />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">
                {item.title}
              </p>
              {item.subtitle && (
                <p className="text-sm font-semibold text-gray-800 leading-tight">
                  {item.subtitle}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HeroBenefits;
