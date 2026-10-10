import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  getSiteSettings,
  getAboutSection,
  getAboutFeatures,
  getSourcingPhilosophy,
  getSourcingPillars,
} from '@/services/contentService';
import { IconRenderer } from '@/components/ui/IconRenderer';

export const metadata: Metadata = {
  title: 'About Us | Committed to Freshness & Local Farmers',
  description:
    'Learn how firstQuality bridges Kerala farmers with modern kitchens and businesses through direct partnerships and sustainable practices.',
};

export default async function AboutPage() {
  const [settings, about, features, sourcing, pillars] = await Promise.all([
    getSiteSettings(),
    getAboutSection(),
    getAboutFeatures(),
    getSourcingPhilosophy(),
    getSourcingPillars(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 pt-28">
        {/* About Hero Header */}
        <div className="relative py-20 bg-gradient-to-b from-[#eaf6ee] to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
              ABOUT FIRSTQUALITY
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mt-2 mb-4">
              Committed to Freshness, Quality and Local Farmers
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl leading-relaxed">
              We started firstQuality with a single mission: to cut unnecessary middlemen, guarantee fair compensation to Kerala farmers, and ensure every household and restaurant receives genuine, farm-fresh produce harvested the very same day.
            </p>
          </div>
        </div>

        {/* Narrative & Visual Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={about.image_url || '/images/farmer-field.jpg'}
                  alt="Farmer working with firstQuality"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="lg:col-span-6 space-y-6">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Building a Sustainable Agricultural Ecosystem in Kerala
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Kerala’s fertile lands and generational farming wisdom produce some of the most flavorful vegetables in South India. However, traditional market chains often delay delivery and compromise produce nutrition.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  firstQuality deploys field agricultural staff directly across farm clusters in Thrissur, Palakkad, Wayanad, and Idukki. We conduct strict soil and crop inspections, enforce non-toxic ripening, and use swift cold-chain logistics so that greens and vegetables arrive fresh, crisp, and vibrant.
                </p>
                <div className="pt-2">
                  <Link
                    href="/enquiry"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-[#15803d] hover:bg-[#166534] shadow-md transition-all"
                  >
                    Partner with Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="py-16 bg-[#f8faf8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Our Core Principles</h2>
              <p className="text-sm text-gray-600 mt-2">
                Every vegetable we supply undergoes rigorous monitoring from seed selection to final packing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((card) => (
                <div
                  key={card.id}
                  className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center mb-4">
                    <IconRenderer
                      iconUrl={card.icon_url}
                      iconName={card.icon_name}
                      className="w-6 h-6 text-[#15803d]"
                      alt={card.title}
                    />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sourcing Philosophy Section */}
        <section className="py-20 bg-[#0b2f1f] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl font-extrabold">{sourcing.heading}</h2>
              <p className="text-emerald-100/90 mt-3 text-lg leading-relaxed">
                {sourcing.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {pillars.map((pillar) => (
                <div key={pillar.id} className="bg-white text-gray-900 rounded-2xl p-6 shadow-xl">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center mb-5">
                    <IconRenderer
                      iconUrl={pillar.icon_url}
                      iconName={pillar.icon_name}
                      className="w-6 h-6 text-[#15803d]"
                      alt={pillar.title}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{pillar.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
