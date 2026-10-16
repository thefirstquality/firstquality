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
import { ProductCardItem } from '@/components/products/ProductCardItem';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

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
                    href={buildWhatsAppUrl(
                      settings.whatsapp_number,
                      `Hello, I would like to order from the ${category.name} category.`
                    )}
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
                    <ProductCardItem
                      key={item.id}
                      item={item}
                      categoryImageUrl={category.image_url}
                      whatsappNumber={settings.whatsapp_number}
                    />
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
