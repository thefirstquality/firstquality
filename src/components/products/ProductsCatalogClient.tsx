'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ProductCategory, ProductItem } from '@/types';

interface ProductsCatalogClientProps {
  products: ProductItem[];
  categories: ProductCategory[];
  whatsappNumber: string;
}

export function ProductsCatalogClient({
  products = [],
  categories = [],
  whatsappNumber = '919876543100',
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

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId || c.slug === catId);
    return cat ? cat.name : 'Produce';
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col rounded-3xl overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={item.image_url || '/images/cat-fresh-vegetables.jpg'}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized={item.image_url?.startsWith('/images/')}
                  />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/95 backdrop-blur-sm text-gray-800 shadow-sm">
                      {getCategoryName(item.category_id)}
                    </span>
                  </div>

                  {/* Stock Status */}
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

                {/* Body */}
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

              {/* WhatsApp CTA */}
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
