'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductCategory, ProductItem } from '@/types';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

interface ProductsSectionProps {
  products: ProductItem[];
  categories: ProductCategory[];
  whatsappNumber?: string;
}

export function ProductsSection({
  products = [],
  categories = [],
  whatsappNumber,
}: ProductsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons, categories]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = 260;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter(
      (p) =>
        p.category_id === selectedCategory ||
        categories.find((c) => c.slug === selectedCategory && c.id === p.category_id) ||
        categories.find((c) => c.id === selectedCategory && c.slug === p.category_id)
    );
  }, [products, selectedCategory, categories]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, 8);
  }, [filteredProducts]);


  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-white to-[#fbfdfb]" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Accent Bar + Desktop Scroll Buttons */}
        <div className="mb-8 flex items-end justify-between">
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

          {/* Small Category Scroll Buttons (Desktop Header) */}
          {categories.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5 pb-1">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll categories left"
                className="w-7 h-7 rounded-full border border-gray-200 bg-white hover:bg-emerald-50 text-gray-700 hover:text-[#15803d] hover:border-[#15803d] flex items-center justify-center shadow-xs transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                title="Scroll categories left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Scroll categories right"
                className="w-7 h-7 rounded-full border border-gray-200 bg-white hover:bg-emerald-50 text-gray-700 hover:text-[#15803d] hover:border-[#15803d] flex items-center justify-center shadow-xs transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                title="Scroll categories right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 0 && (
          <div className="mb-8">
            {/* Scrollable Categories Track */}
            <div
              ref={scrollContainerRef}
              className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none scroll-smooth"
            >
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
          </div>
        )}

        {/* Products Grid */}
        {displayedProducts.length > 0 ? (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {displayedProducts.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 justify-between"
                >
                  <div>
                    {/* Product Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                      <Image
                        src={item.image_url || '/images/cat-fresh-vegetables.jpg'}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized={item.image_url?.startsWith('/images/')}
                      />

                      {/* In Stock Badge */}
                      <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3">
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
                    <div className="p-3 sm:p-5 flex flex-col">
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#15803d] transition-colors line-clamp-1 mb-1">
                        {item.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                        {item.unit && (
                          <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded bg-gray-100 text-gray-700 font-semibold text-[10px] sm:text-[11px]">
                            {item.unit}
                          </span>
                        )}
                        {item.price_text && (
                          <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded bg-emerald-50 text-[#15803d] font-bold text-[10px] sm:text-[11px]">
                            {item.price_text}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] sm:text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Product Action: Order via WhatsApp */}
                  <div className="p-2.5 pt-0 sm:p-5 sm:pt-0">
                    <a
                      href={buildWhatsAppUrl(
                        whatsappNumber,
                        `Hello firstQuality, I would like to order: ${item.name}${item.unit ? ` (${item.unit})` : ''}${item.price_text ? ` - ${item.price_text}` : ''}. Please share availability and delivery details.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-3 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] transition-all duration-200 shadow-xs sm:shadow-sm hover:shadow-md active:scale-95 group/wa"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.128-.53-1.636-.687-2.73-2.336-2.812-2.446-.082-.11-1.025-1.36-1.025-2.593 0-1.233.649-1.84.88-2.091.231-.251.503-.314.671-.314.168 0 .336.002.483.009.155.008.363-.058.568.435.212.51.721 1.76.785 1.89.063.13.106.282.019.452-.086.17-.13.277-.257.424-.128.147-.268.328-.383.441-.128.125-.262.261-.113.518.15.257.666 1.096 1.431 1.777.986.877 1.817 1.15 2.074 1.278.257.127.408.106.56-.068.151-.174.648-.754.821-1.013.172-.258.345-.216.582-.128.237.087 1.504.709 1.763.838.258.13.431.194.495.302.064.108.064.629-.08 1.034z" />
                      </svg>
                      <span className="whitespace-nowrap">Order via WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom View Full Catalog Button */}
            {products.length > 8 && (
              <div className="mt-12 text-center">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-[#0e3d23] hover:bg-[#15803d] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 group"
                >
                  <span>View All Catalog ({products.length} Products)</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-b from-emerald-50/40 to-white rounded-3xl border border-emerald-100/80 p-8 shadow-sm">
            <div className="text-4xl mb-3">🥦</div>
            <h3 className="text-xl font-bold text-gray-900">Fresh Harvest Catalog Updating</h3>
            <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
              Our daily harvest catalog is being updated. You can add new products in the Admin panel or contact us directly on WhatsApp for today&apos;s available vegetables.
            </p>
            <a
              href={buildWhatsAppUrl(
                whatsappNumber,
                'Hello firstQuality, I would like to inquire about today\'s available produce and rates.'
              )}
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
