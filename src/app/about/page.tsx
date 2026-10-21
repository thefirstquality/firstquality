import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  getSiteSettings,
  getAboutSection,
} from '@/services/contentService';

export const metadata: Metadata = {
  title: 'About Us | Committed to Freshness & Local Farmers',
  description:
    'Learn how firstQuality bridges Kerala farmers with modern kitchens and businesses through direct partnerships and sustainable practices.',
};
export const instant = false;

export default async function AboutPage() {
  const [settings, about] = await Promise.all([
    getSiteSettings(),
    getAboutSection(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* About Hero Header */}
        <div className="relative pt-32 sm:pt-36 pb-14 bg-gradient-to-b from-[#eaf6ee] to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
              ABOUT FIRSTQUALITY
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mt-2 mb-3">
              Committed to Freshness, Quality and Local Farmers
            </h1>
            <div className="w-14 h-1 bg-[#f97316] rounded-full mb-4" />
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
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

        {/* Mission & Vision Section */}
        <section className="py-20 bg-[#f8faf8] border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#15803d] tracking-tight">
                Mission & Vision
              </h2>
              <div className="w-12 h-1 bg-[#f97316] rounded-full mx-auto mt-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Mission Card */}
              <div className="bg-white rounded-2xl p-8 sm:p-9 border border-gray-100 border-t-4 border-t-[#15803d] shadow-lg shadow-gray-200/50 hover:shadow-xl transition-shadow flex flex-col justify-start">
                <div className="flex items-center gap-3 mb-4">
                  <svg
                    className="w-7 h-7 text-[#15803d] flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                  </svg>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Our Mission
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                  To establish an efficient, direct bridge between local agricultural producers and local households through our retail outlets. We aim to eliminate unnecessary supply chain holds and bureaucratic delays, ensuring farmers receive prompt, fair value while consumers enjoy fresh, hand-picked produce harvested at its prime.
                </p>
              </div>

              {/* Vision Card */}
              <div className="bg-white rounded-2xl p-8 sm:p-9 border border-gray-100 border-t-4 border-t-[#f97316] shadow-lg shadow-gray-200/50 hover:shadow-xl transition-shadow flex flex-col justify-start">
                <div className="flex items-center gap-3 mb-4">
                  <svg
                    className="w-7 h-7 text-[#f97316] flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="13.5" cy="10.5" r="1.5" fill="currentColor" />
                  </svg>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Our Vision
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                  To redefine produce retail by prioritizing real-world quality, direct farm oversight, and operational transparency over marketing buzzwords. We envision a sustainable retail model where local agriculture thrives through direct consumer connections and responsible farming practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Sourcing Philosophy Section */}
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#15803d] tracking-tight">
                Our Sourcing Philosophy
              </h2>
              <div className="w-12 h-1 bg-[#f97316] rounded-full mx-auto mt-3" />
            </div>

            <div className="max-w-5xl mx-auto bg-[#f4faf5] rounded-3xl p-8 sm:p-10 lg:p-12 border border-emerald-100/80 border-l-[6px] border-l-[#15803d] shadow-sm">
              <h3 className="text-xl sm:text-2xl font-bold text-[#15803d] mb-4">
                Beyond Marketing Buzzwords: Practical Quality &amp; Real Safety
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-8 sm:mb-10 font-normal">
                At <strong className="font-bold text-gray-900">firstQuality</strong>, we intentionally do not get caught up in marketing definitions of &quot;organic,&quot; complex certifications, or exaggerated claims. We recognize the practical realities of farming, harvest availability, and true product value. Instead of chasing buzzwords, our core commitment is simple and transparent: <strong className="font-bold text-gray-900">handpicking produce directly from local farms through our dedicated field staff</strong>. We work directly with farmers, providing hands-on advice on sustainable farming practices, optimal harvest timing, and strict quality control—ensuring fresh, safe, and premium produce every single day.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* 1. Field Staff Supervised */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 flex items-center justify-center text-[#f97316] mb-3">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <polyline points="16 11 18 13 22 9" />
                    </svg>
                  </div>
                  <h4 className="text-base font-bold text-[#15803d] mb-2">
                    Field Staff Supervised
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Our team physically visits fields to inspect and select only prime produce.
                  </p>
                </div>

                {/* 2. Good Farming Practices */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 flex items-center justify-center text-[#f97316] mb-3">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21a1 1 0 0 1-1-1v-8a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1Z" />
                      <path d="M12 12c-4 0-7.5-2.5-7.5-7 5 0 7.5 2.5 7.5 7Z" />
                      <path d="M12 9c4 0 7.5-2.5 7.5-7-5 0-7.5 2.5-7.5 7Z" />
                    </svg>
                  </div>
                  <h4 className="text-base font-bold text-[#15803d] mb-2">
                    Good Farming Practices
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We actively guide partner farmers toward safe, clean, and sustainable cultivation.
                  </p>
                </div>

                {/* 3. Direct Farmer Partnership */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 flex items-center justify-center text-[#f97316] mb-3">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4l-3-3" />
                      <path d="m13 7-2-2a1 1 0 0 0-1.4 0L5.3 9.3a1 1 0 0 0 0 1.4l3 3" />
                      <path d="m18 11 2.5 2.5a1 1 0 0 1 0 1.4l-2 2a1 1 0 0 1-1.4 0L15 15" />
                      <path d="m6 13-2.5-2.5a1 1 0 0 1 0-1.4l2-2a1 1 0 0 1 1.4 0L9 9" />
                    </svg>
                  </div>
                  <h4 className="text-base font-bold text-[#15803d] mb-2">
                    Direct Farmer Partnership
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Empowering local growers with technical advisory and direct retail market access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
