import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSiteSettings } from '@/services/contentService';
import { ContactForm } from '@/components/ui/ContactForm';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Wholesale Vegetables | Reliable Bulk Supply | firstQuality',
  description:
    'Quality vegetables, reliable supply, and competitive wholesale prices for retailers, supermarkets, hotels, restaurants, caterers, and bulk buyers across Kerala.',
  keywords: [
    'wholesale vegetables',
    'bulk vegetable supply',
    'kerala vegetable wholesale',
    'vegetable distributor',
    'hotel vegetable supplier',
    'supermarket vegetable supply',
  ],
};

export const instant = false;

export default async function WholesalePage() {
  const settings = await getSiteSettings();

  const wholesaleRange = [
    {
      title: 'Everyday Essentials',
      desc: 'Onions, potatoes, tomatoes and other regularly purchased vegetables.',
      badge: 'High Demand',
      icon: (
        <svg className="w-6 h-6 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      title: 'Locally Grown Produce',
      desc: 'Vegetables sourced from nearby farms when available.',
      badge: 'Direct Farm',
      icon: (
        <svg className="w-6 h-6 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      ),
    },
    {
      title: 'Seasonal Vegetables',
      desc: 'Produce selected according to seasonal availability.',
      badge: 'Peak Freshness',
      icon: (
        <svg className="w-6 h-6 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'Exotic & Specialty Vegetables',
      desc: 'Selected varieties, including coloured capsicum and other specialty produce.',
      badge: 'Premium Grade',
      icon: (
        <svg className="w-6 h-6 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      title: 'Root and Tuber Vegetables',
      desc: 'A range of vegetables for retail and commercial use.',
      badge: 'Extended Shelf Life',
      icon: (
        <svg className="w-6 h-6 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: 'Bulk Supply Solutions',
      desc: 'Vegetable sourcing tailored to your business requirements.',
      badge: 'Custom Contract',
      icon: (
        <svg className="w-6 h-6 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  const whyChoosePillars = [
    {
      title: 'Carefully Selected Produce',
      desc: 'We pay attention to freshness, appearance and overall product quality.',
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    {
      title: 'Competitive Wholesale Pricing',
      desc: 'We focus on value-conscious sourcing to help our business customers manage purchasing costs.',
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Flexible Sourcing',
      desc: 'We combine locally available produce with vegetables from other growing regions to offer variety and continuity.',
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      title: 'Business-Focused Supply',
      desc: 'We work with buyers to understand their quantities, product preferences and supply requirements.',
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  const whoWeServe = [
    {
      name: 'Vegetable Retailers',
      detail: 'Consistent daily supply for standalone and franchise shops',
      icon: (
        <svg className="w-6 h-6 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9l1-5h16l1 5M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0M3 9v10a2 2 0 002 2h14a2 2 0 002-2V9M9 21v-6a2 2 0 012-2h2a2 2 0 012 2v6" />
        </svg>
      ),
    },
    {
      name: 'Supermarkets',
      detail: 'Graded, weighed and uniform produce for consumer aisles',
      icon: (
        <svg className="w-6 h-6 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: 'Hotels and Restaurants',
      detail: 'Chef-ready fresh vegetables delivered before morning prep',
      icon: (
        <svg className="w-6 h-6 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v2m0 0a8 8 0 018 8H4a8 8 0 018-8zm-9 12h18a1 1 0 011 1v1H2v-1a1 1 0 011-1zm3 5h12" />
        </svg>
      ),
    },
    {
      name: 'Caterers',
      detail: 'High-volume seasonal deliveries for wedding & event banquets',
      icon: (
        <svg className="w-6 h-6 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a7 7 0 01-14 0m14 0h2m-16 0H3m6-7v3m4-3v3m4-3v3M7 18l1.5 3h7L17 18" />
        </svg>
      ),
    },
    {
      name: 'Hostels and Canteens',
      detail: 'Reliable, cost-effective staples for mass community dining',
      icon: (
        <svg className="w-6 h-6 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 2l9 4.5v2.5H3V6.5L12 2zm-7 7v9h3v-9m4 0v9h2v-9m4 0v9h3v-9M2 21h20" />
        </svg>
      ),
    },
    {
      name: 'Institutions & Commercial Kitchens',
      detail: 'Structured contract sourcing tailored to institutional standards',
      icon: (
        <svg className="w-6 h-6 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 21h18M5 21V7a2 2 0 012-2h4a2 2 0 012 2v14M13 21V3a2 2 0 012-2h4a2 2 0 012 2v18M7 9h2m-2 4h2m-2 4h2m8-12h2m-2 4h2m-2 4h2m-2 4h2" />
        </svg>
      ),
    },
  ];

  const whatsappMessage = encodeURIComponent(
    'Hello firstQuality, I would like to enquire about your Wholesale Vegetable supply, product availability, and pricing.'
  );
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp_number, 'Hello firstQuality, I would like to enquire about your Wholesale Vegetable supply, product availability, and pricing.');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header enquireUrl="#enquire" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 sm:pt-36 pb-14 sm:pb-20 bg-gradient-to-b from-[#eaf6ee] via-[#f4faf5] to-white border-b border-gray-100">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-100/50 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-50/70 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-[#15803d] text-xs font-bold uppercase tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse" />
                WHOLESALE SUPPLY
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
                Quality Vegetables. Reliable Supply.{' '}
                <span className="text-[#15803d]">Competitive Prices.</span>
              </h1>

              <div className="w-16 h-1.5 bg-[#f97316] rounded-full mb-6" />

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                At <span className="font-semibold text-gray-900">firstQuality</span>, we supply carefully selected fresh vegetables to retailers, supermarkets, hotels, restaurants, caterers, hostels and other bulk buyers.
              </p>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8">
                We give preference to vegetables grown by nearby farmers whenever available, while sourcing additional varieties from established growing regions across India. This approach helps us offer a wider selection of produce, with a focus on freshness, quality and competitive pricing.
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <a
                  href="#enquire"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-bold text-white bg-[#15803d] hover:bg-[#166534] active:scale-95 transition-all shadow-md hover:shadow-lg"
                >
                  Enquire About Wholesale
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-[#15803d] active:scale-95 transition-all shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2.5 text-[#25D366] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Wholesale Desk
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Our Wholesale Range */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
                PRODUCT SELECTION
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2 mb-3">
                Our Wholesale Range
              </h2>
              <div className="w-12 h-1 bg-[#f97316] rounded-full mx-auto mb-4" />
              <p className="text-sm sm:text-base text-gray-600">
                Carefully graded produce categorized to meet the specific procurement needs of businesses across diverse food sectors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {wholesaleRange.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative p-6 sm:p-8 rounded-3xl bg-[#fbfdfb] border border-gray-200/80 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-gray-200 text-gray-700 shadow-2xs">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#15803d] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#15803d]">
                    <span>Available in Bulk</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Why Choose firstQuality? */}
        <section className="py-16 sm:py-24 bg-[#f8faf8] border-y border-gray-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
                THE FIRSTQUALITY ADVANTAGE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2 mb-3">
                Why Choose firstQuality?
              </h2>
              <div className="w-12 h-1 bg-[#f97316] rounded-full mx-auto mb-4" />
              <p className="text-sm sm:text-base text-gray-600">
                A dependable procurement partner designed around commercial reliability, consistency, and transparent relationships.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChoosePillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                    {pillar.icon}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Who We Serve */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
                OUR CLIENT SECTORS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2 mb-3">
                Who We Serve
              </h2>
              <div className="w-12 h-1 bg-[#f97316] rounded-full mx-auto mb-4" />
              <p className="text-sm sm:text-base text-gray-600">
                Supplying fresh vegetable quantities across various scale operations in Kerala.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {whoWeServe.map((item, idx) => (
                <div
                  key={idx}
                  className="group flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-[#fbfdfb] border border-gray-200/80 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-950/5 hover:bg-white transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-emerald-100/70 transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#15803d] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Let's Grow Your Business Together (Enquiry Form) */}
        <section id="enquire" className="py-16 sm:py-24 bg-gradient-to-b from-[#f8faf8] to-white border-t border-gray-200/70 scroll-mt-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-gray-200/90 shadow-xl shadow-emerald-950/5">
              <div className="text-center max-w-xl mx-auto mb-10">
                <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
                  PARTNER WITH FIRSTQUALITY
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-3">
                  Let’s Grow Your Business Together
                </h2>
                <div className="w-12 h-1 bg-[#f97316] rounded-full mx-auto mb-4" />
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Looking for a vegetable supply partner for your business? Contact firstQuality to discuss product availability, quantities, pricing and regular supply requirements.
                </p>
              </div>

              {/* Direct Wholesale Contact Form */}
              <ContactForm defaultEnquiryType="wholesale" buttonText="Enquire About Wholesale" />

              {/* Direct Contacts Footer Strip */}
              <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="block text-xs text-gray-500 font-medium">Wholesale Phone</span>
                  <a href={`tel:${settings.phone}`} className="text-sm font-bold text-gray-900 hover:text-[#15803d] transition-colors">
                    {settings.phone}
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="block text-xs text-gray-500 font-medium">WhatsApp Supply Desk</span>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors">
                    Chat on WhatsApp
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="block text-xs text-gray-500 font-medium">Email Desk</span>
                  <a href="mailto:info@thefirstquality.in" className="text-sm font-bold text-gray-900 hover:text-[#15803d] transition-colors">
                    info@thefirstquality.in
                  </a>
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
