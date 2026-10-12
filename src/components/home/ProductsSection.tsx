'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { ProductCategory, ProductItem } from '@/types';

interface ProductsSectionProps {
  products: ProductItem[];
  categories: ProductCategory[];
  whatsappNumber?: string;
}

export function ProductsSection({
  products = [],
  categories = [],
  whatsappNumber = '919876543100',
}: ProductsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter(
      (p) =>
        p.category_id === selectedCategory ||
        categories.find((c) => c.slug === selectedCategory && c.id === p.category_id) ||
        categories.find((c) => c.id === selectedCategory && c.slug === p.category_id)
    );
  }, [products, selectedCategory, categories]);

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId || c.slug === catId);
    return cat ? cat.name : 'Fresh Produce';
  };

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-white to-[#fbfdfb]" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title, Accent Bar & View All Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
              OUR PRODUCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-1 mb-3">
              Fresh and Quality Products
            </h2>
            {/* Orange Accent Line */}
            <div className="w-14 h-1 bg-[#f97316] rounded-full" />
          </div>

          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0b2f1f] bg-white border border-gray-200 hover:border-[#15803d] hover:bg-emerald-50/50 shadow-sm transition-all duration-200 group"
            >
              <span>View Full Catalog ({products.length})</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#15803d] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              All Items ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter(
                (p) => p.category_id === cat.id || p.category_id === cat.slug
              ).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id || selectedCategory === cat.slug
                      ? 'bg-[#15803d] text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col rounded-3xl overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 justify-between"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={item.image_url || '/images/cat-fresh-vegetables.jpg'}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized={item.image_url?.startsWith('/images/')}
                    />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/95 backdrop-blur-sm text-gray-800 shadow-sm">
                        {getCategoryName(item.category_id)}
                      </span>
                    </div>

                    {/* In Stock Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                          item.in_stock
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {item.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="p-5 flex flex-col">
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15803d] transition-colors line-clamp-1 mb-1">
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-2">
                      {item.unit && (
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold text-[11px]">
                          {item.unit}
                        </span>
                      )}
                      {item.price_text && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#15803d] font-bold text-[11px]">
                          {item.price_text}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* WhatsApp Order Action */}
                <div className="p-5 pt-0">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      `Hello firstQuality, I would like to order: ${item.name} (${item.unit || 'Standard Pack'})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-[#15803d] bg-emerald-50 hover:bg-[#15803d] hover:text-white transition-all duration-200 shadow-sm active:scale-95"
                  >
                    <span>💬 Order via WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-b from-emerald-50/40 to-white rounded-3xl border border-emerald-100/80 p-8 shadow-sm">
            <div className="text-4xl mb-3">🥦</div>
            <h3 className="text-xl font-bold text-gray-900">Fresh Harvest Catalog Updating</h3>
            <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
              Our daily harvest catalog is being updated. You can add new products in the Admin panel or contact us directly on WhatsApp for today&apos;s available vegetables.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                'Hello firstQuality, I would like to inquire about today\'s available produce and rates.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#15803d] hover:bg-[#166534] shadow-md transition-all"
            >
              <span>💬 Inquire on WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductsSection;
