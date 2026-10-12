import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  getSiteSettings,
  getCategoryBySlug,
  getProductCategories,
  getProductsByCategory,
  DEFAULT_CATEGORIES,
} from '@/services/contentService';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export const instant = false;

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: 'Category Not Found | firstQuality' };
  }

  return {
    title: `${category.name} | firstQuality Kerala`,
    description: category.short_description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const [settings, category, allCategories] = await Promise.all([
    getSiteSettings(),
    getCategoryBySlug(slug),
    getProductCategories(),
  ]);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(category.id);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 pt-28">
        {/* Category Header */}
        <div className="py-14 bg-gradient-to-b from-[#eaf6ee] to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">
              <Link href="/" className="hover:text-green-700">
                Home
              </Link>
              <span>/</span>
              <Link href="/products" className="hover:text-green-700">
                Products
              </Link>
              <span>/</span>
              <span className="text-[#15803d]">{category.name}</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              {category.name}
            </h1>
            <div className="w-12 h-1 bg-[#f97316] rounded-full mb-3" />
            <p className="text-base text-gray-600 max-w-2xl">
              {category.short_description}
            </p>
          </div>
        </div>

        {/* Category Overview */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
              <div className="lg:col-span-5 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="lg:col-span-7 space-y-5">
                <h2 className="text-2xl font-bold text-gray-900">
                  About Our {category.name} Sourcing
                </h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  {category.full_description || category.short_description}
                </p>
                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100/80">
                  <h3 className="text-sm font-bold text-[#15803d] uppercase tracking-wider mb-1.5">
                    Quality Promise
                  </h3>
                  <p className="text-sm text-gray-700">
                    Sourced directly from verified farmers across Kerala. Strict quality checked, 100% free from chemical waxes or toxic preservation sprays.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-1">
                  <Link
                    href={`/enquiry?category=${encodeURIComponent(category.name)}`}
                    className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#15803d] hover:bg-[#166534] shadow-md transition-all"
                  >
                    Order or Enquire for this Category
                  </Link>
                  <a
                    href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
                      `Hello, I would like to order from the ${category.name} category.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl text-sm font-semibold text-[#15803d] bg-white border border-[#15803d] hover:bg-emerald-50 transition-all"
                  >
                    Order via WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Products in this category */}
            <div className="pt-10 border-t border-gray-100 mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold text-[#15803d] uppercase tracking-wider">
                    FRESH PRODUCE CATALOG
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                    Available Items in {category.name}
                  </h3>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-[#15803d]">
                  {products.length} Items Listed
                </span>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-[#fbfdfb] hover:bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                          <Image
                            src={item.image_url || category.image_url}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized={item.image_url?.startsWith('/images/')}
                          />
                          <div className="absolute top-2 right-2">
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

                        <div className="p-5 space-y-2">
                          <h4 className="text-base font-bold text-gray-900 group-hover:text-[#15803d] transition-colors line-clamp-1">
                            {item.name}
                          </h4>

                          <div className="flex items-center gap-2 text-xs">
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

                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 pt-0">
                        <a
                          href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
                            `Hello, I would like to order: ${item.name} (${item.unit || 'Standard Pack'}) from firstQuality.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#15803d] bg-emerald-50 hover:bg-[#15803d] hover:text-white transition-all shadow-sm"
                        >
                          <span>💬 Order via WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                  <p className="text-gray-500 text-sm">
                    No individual items published in this category yet. Contact us directly for daily harvest updates.
                  </p>
                </div>
              )}
            </div>

            {/* Other Categories */}
            <div className="pt-12 border-t border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-8">
                Explore Other Categories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {allCategories
                  .filter((c) => c.slug !== category.slug)
                  .map((other) => (
                    <Link
                      key={other.id}
                      href={`/products/${other.slug}`}
                      className="group p-5 rounded-2xl border border-gray-100 hover:shadow-lg transition-all flex items-center gap-4 bg-[#fbfdfb] hover:bg-white"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={other.image_url}
                          alt={other.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-gray-900 group-hover:text-[#15803d] transition-colors">
                          {other.name}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                          {other.short_description}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
