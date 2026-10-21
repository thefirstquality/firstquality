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
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
