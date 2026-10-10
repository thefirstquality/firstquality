'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { TestimonialItem } from '@/types';

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-gray-50">
      {/* Background Image: Chef in kitchen/market with soft right alignment */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/testimonial-chef.jpg"
          alt="Restaurant chef testimonial background"
          fill
          sizes="100vw"
          className="object-cover object-right md:object-center opacity-90"
        />
        {/* Soft gradient from left to ensure testimonial card pops */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent sm:via-white/60 sm:to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading on Left */}
        <div className="mb-10 max-w-xl">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
            TRUSTED BY HOMES, RETAILERS AND BUSINESSES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-1">
            What Our Customers Say
          </h2>
        </div>

        {/* Carousel Container with Prev/Next Controls */}
        <div className="relative max-w-xl">
          {/* Testimonial Card matching Reference 2 */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 sm:p-10 shadow-xl border border-gray-100 transition-all duration-300">
            {/* Green Quote Mark */}
            <div className="text-4xl font-serif text-[#15803d] leading-none mb-4 select-none">
              “
            </div>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal mb-8">
              {current.quote}
            </p>

            {/* Author Avatar and Info */}
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500/30 flex-shrink-0 bg-gray-100">
                <Image
                  src={current.avatar_url || '/images/testimonial-avatar.jpg'}
                  alt={current.customer_name}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                  {current.customer_name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-normal">
                  {current.role}
                  {current.location && `, ${current.location}`}
                </p>
              </div>
            </div>
          </div>

          {/* Circular Carousel Controls matching Reference 2 */}
          {testimonials.length > 1 && (
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 text-gray-700 hover:text-[#15803d] hover:border-[#15803d] flex items-center justify-center transition-all active:scale-95"
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 text-gray-700 hover:text-[#15803d] hover:border-[#15803d] flex items-center justify-center transition-all active:scale-95"
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
