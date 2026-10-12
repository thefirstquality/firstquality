import React from 'react';
import Image from 'next/image';
import type { StatisticItem } from '@/types';
import { IconRenderer } from '@/components/ui/IconRenderer';

interface StatsBannerProps {
  stats: StatisticItem[];
}

export function StatsBanner({ stats }: StatsBannerProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="relative py-5 sm:py-6 bg-[#0b2f1f] text-white overflow-hidden">
      {/* Subtle leaf texture overlay */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
        <Image
          src="/images/leaf-texture-bg.jpg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-3 sm:gap-y-4 sm:gap-x-6 lg:gap-y-0 lg:divide-x divide-emerald-800/60">
          {stats.map((item, index) => (
            <div
              key={item.id || index}
              className="flex flex-col items-center text-center px-1 sm:px-3"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-800/50 flex items-center justify-center text-green-300 mb-1.5">
                <IconRenderer
                  iconUrl={item.icon_url}
                  iconName={item.icon_name}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-300"
                  alt={item.label}
                />
              </div>

              <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-0.5">
                {item.number_value}
              </div>

              <div className="text-xs sm:text-sm font-semibold text-emerald-100 leading-tight">
                {item.label}
              </div>

              {item.sublabel && (
                <div className="text-[10px] sm:text-[11px] text-emerald-300/80 font-normal mt-0.5 leading-tight">
                  {item.sublabel}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsBanner;
