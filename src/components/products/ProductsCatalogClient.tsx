'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ProductCategory, ProductItem } from '@/types';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

interface ProductsCatalogClientProps {
  products: ProductItem[];
  categories: ProductCategory[];
  whatsappNumber?: string;
}

export function ProductsCatalogClient({
  products = [],
  categories = [],
  whatsappNumber,
}: ProductsCatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock'>('all');

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const matches =
          item.category_id === selectedCategory ||
          categories.find((c) => c.slug === selectedCategory && c.id === item.category_id) ||
          categories.find((c) => c.id === selectedCategory && c.slug === item.category_id);
        if (!matches) return false;
      }

      // Stock filter
      if (stockFilter === 'in_stock' && !item.in_stock) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesUnit = item.unit?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesUnit) return false;
      }

      return true;
    });
  }, [products, selectedCategory, stockFilter, searchQuery, categories]);


  return (
    <div className="space-y-8">
      {/* Search & Category Filter Header */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search farm fresh produce (e.g. Tomatoes, Okra, Sambar Cut)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
            />
            <span className="absolute left-3.5 top-3 text-gray-400 text-sm">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-xs text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStockFilter(stockFilter === 'all' ? 'in_stock' : 'all')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                stockFilter === 'in_stock'
                  ? 'bg-emerald-50 border-emerald-300 text-[#15803d]'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {stockFilter === 'in_stock' ? '✓ Showing In-Stock Only' : 'Show In-Stock Only'}
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-gray-100 pt-3 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#15803d] text-white shadow-md'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Products ({products.length})
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
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={item.image_url || '/images/cat-fresh-vegetables.jpg'}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized={item.image_url?.startsWith('/images/')}
                  />

                  {/* Stock Status */}
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

                {/* Body */}
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
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="text-4xl mb-3">🥦</div>
          <h3 className="text-lg font-bold text-gray-900">No products found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No produce matching "${searchQuery}". Try searching for tomatoes, okra, or sambar cut.`
              : 'There are no products listed in this category yet.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setStockFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-[#15803d] bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
