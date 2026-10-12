import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  getSiteSettings,
  getProductCategories,
  getProducts,
} from '@/services/contentService';
import { ProductsCatalogClient } from '@/components/products/ProductsCatalogClient';

export const metadata: Metadata = {
  title: 'Our Products | Fresh and Quality Produce',
  description:
    'Discover our full range of farm-fresh Kerala vegetables, hygienic cut veggies, recipe combo kits, and kitchen pantry essentials.',
};

export const instant = false;

export default async function ProductsPage() {
  const [settings, categories, products] = await Promise.all([
    getSiteSettings(),
    getProductCategories(),
    getProducts(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 pt-28">
        {/* Banner */}
        <div className="py-14 bg-gradient-to-b from-[#eaf6ee] to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
              OUR PRODUCE CATALOG
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mt-2 mb-3">
              Fresh and Quality Produce
            </h1>
            <div className="w-14 h-1 bg-[#f97316] rounded-full mb-4" />
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
              Harvested daily from local farmers across Kerala. We guarantee premium grading, hygienic packing, and timely distribution for homes, caterers, and retailers.
            </p>
          </div>
        </div>

        {/* Products Catalog Section */}
        <section className="py-12 bg-[#fbfdfb]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductsCatalogClient
              products={products}
              categories={categories}
              whatsappNumber={settings.whatsapp_number}
            />


          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
