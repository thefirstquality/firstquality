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
    <section className="relative py-16 bg-[#0b2f1f] text-white overflow-hidden">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-emerald-800/60">
          {stats.map((item, index) => (
            <div
              key={item.id || index}
              className={`flex flex-col items-center text-center px-4 ${
                index > 0 ? 'pt-6 sm:pt-0' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-800/50 flex items-center justify-center text-green-300 mb-4">
                <IconRenderer
                  iconUrl={item.icon_url}
                  iconName={item.icon_name}
                  className="w-6 h-6 text-green-300"
                  alt={item.label}
                />
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                {item.number_value}
              </div>

              <div className="text-base font-semibold text-emerald-100 mb-0.5">
                {item.label}
              </div>

              {item.sublabel && (
                <div className="text-xs sm:text-sm text-emerald-300/80 font-normal">
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
