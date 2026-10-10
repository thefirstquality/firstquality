import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { ProductCategory } from '@/types';

interface ProductsSectionProps {
  categories: ProductCategory[];
}

export function ProductsSection({ categories }: ProductsSectionProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title, Accent Bar & View All Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
              OUR PRODUCTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-1 mb-3">
              Fresh and Quality Produce
            </h2>
            {/* Orange Accent Line from Reference 2 */}
            <div className="w-14 h-1 bg-[#f97316] rounded-full" />
          </div>

          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-[#0d3a22] border border-[#0d3a22]/40 hover:border-[#0d3a22] hover:bg-emerald-50/50 transition-all duration-200 group"
            >
              <span>View All Products</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products/${cat.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Category Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <Image
                  src={cat.image_url || '/images/cat-fresh-vegetables.jpg'}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Category Content */}
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#15803d] transition-colors mb-2">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">
                  {cat.short_description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductsSection;
