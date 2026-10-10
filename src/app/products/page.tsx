import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSiteSettings, getProductCategories } from '@/services/contentService';

export const metadata: Metadata = {
  title: 'Our Products | Fresh and Quality Produce',
  description:
    'Discover our full range of farm-fresh Kerala vegetables, hygienic cut veggies, recipe combo kits, and kitchen pantry essentials.',
};

export default async function ProductsPage() {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getProductCategories(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 pt-28">
        {/* Banner */}
        <div className="py-16 bg-gradient-to-b from-[#eaf6ee] to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
              OUR PRODUCE CATALOG
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mt-2 mb-3">
              Fresh and Quality Produce
            </h1>
            <div className="w-14 h-1 bg-[#f97316] rounded-full mb-4" />
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
              Harvested daily from local farmers across Kerala. We guarantee premium grading, hygienic packing, and timely distribution for homes, caterers, and retailers.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="group rounded-3xl overflow-hidden border border-gray-100 bg-[#fbfdfb] hover:bg-white hover:shadow-2xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#15803d] transition-colors mb-2">
                      {cat.name}
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">
                      {cat.short_description}
                    </p>

                    <div className="pt-2">
                      <Link
                        href={`/products/${cat.slug}`}
                        className="inline-flex items-center justify-center w-full px-5 py-2.5 rounded-xl text-sm font-semibold text-[#15803d] bg-emerald-50 hover:bg-[#15803d] hover:text-white transition-all duration-200"
                      >
                        Explore Category →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Bulk Order Box */}
            <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-[#0b2f1f] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
              <div>
                <span className="text-xs font-bold text-green-400 uppercase tracking-widest">
                  COMMERCIAL & WHOLESALE SOURCING
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-2">
                  Need Bulk Supplies for Hotels or Supermarkets?
                </h3>
                <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl">
                  We supply sorted, weighed, and crated vegetables in bulk every morning. Get customized price contracts and credit terms.
                </p>
              </div>

              <div className="flex-shrink-0">
                <Link
                  href="/enquiry"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-sm font-bold text-[#0b2f1f] bg-white hover:bg-emerald-50 transition-all shadow-md active:scale-95"
                >
                  Request Wholesale Rate Card
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
