import React from 'react';
import type { HeroBenefit } from '@/types';
import { IconRenderer } from '@/components/ui/IconRenderer';

interface HeroBenefitsProps {
  benefits: HeroBenefit[];
}

export function HeroBenefits({ benefits }: HeroBenefitsProps) {
  if (!benefits || benefits.length === 0) return null;

  return (
    <div className="bg-white/95 sm:bg-white rounded-2xl shadow-md sm:shadow-lg border border-gray-100 p-3 sm:p-5 lg:p-6 backdrop-blur-sm">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 lg:divide-x lg:divide-gray-100">
        {benefits.map((item, index) => (
          <div
            key={item.id || index}
            className={`p-2.5 sm:p-0 rounded-xl sm:rounded-none bg-emerald-50/50 sm:bg-transparent flex items-start sm:items-center gap-2.5 sm:gap-4 ${
              index > 0 ? 'lg:pl-6' : ''
            }`}
          >
            <div className="flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-white sm:bg-emerald-50 text-[#15803d] flex items-center justify-center shadow-xs sm:shadow-none border border-emerald-100/80 sm:border-0">
              <IconRenderer
                iconUrl={item.icon_url}
                iconName={item.icon_name}
                className="w-4 h-4 sm:w-5 sm:h-5 text-[#15803d]"
                alt={item.title}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                {item.title}
              </p>
              {item.subtitle && (
                <p className="text-[11px] sm:text-xs lg:text-sm font-semibold text-gray-700 sm:text-gray-800 leading-tight mt-0.5">
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
