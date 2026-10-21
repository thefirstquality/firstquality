import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSiteSettings } from '@/services/contentService';
import { ContactForm } from '@/components/ui/ContactForm';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Fresh Vegetable Exports | Indian Produce Globally Connected | firstQuality',
  description:
    'Connecting international buyers with carefully selected fresh vegetables from India. Responsible sourcing from Kerala and major growing regions, quality-conscious handling, and coordinated global supply arrangements.',
  keywords: [
    'Indian vegetable export',
    'fresh vegetables exporter India',
    'Kerala vegetable export',
    'traditional Indian vegetables overseas',
    'bulk vegetables exporter',
    'vegetables for international markets',
  ],
};

export const instant = false;

export default async function ExportsPage() {
  const settings = await getSiteSettings();

  const exportRange = [
    {
      title: 'Fresh Vegetables',
      desc: 'A selection of commonly traded fresh vegetables.',
      badge: 'Export Grade',
      icon: (
        <svg className="w-6 h-6 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      ),
    },
    {
      title: 'Traditional Indian Vegetables',
      desc: 'Produce suited to Indian grocery stores and international markets serving South Asian communities.',
      badge: 'Heritage Varieties',
      icon: (
        <svg className="w-6 h-6 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: 'Root and Tuber Vegetables',
      desc: 'Selected varieties based on buyer requirements and availability.',
      badge: 'Sturdy & Long-Life',
      icon: (
        <svg className="w-6 h-6 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: 'Seasonal Produce',
      desc: 'Vegetables sourced according to growing seasons and market demand.',
      badge: 'Seasonal Pick',
      icon: (
        <svg className="w-6 h-6 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'Specialty Vegetables',
      desc: 'Selected varieties available through our sourcing network.',
      badge: 'Niche Sourcing',
      icon: (
        <svg className="w-6 h-6 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
  ];

  const qualityPillars = [
    {
      title: 'Careful Product Selection',
      desc: 'We prioritise freshness, appearance and suitability for the intended market.',
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Responsible Sourcing',
      desc: 'We favour nearby farm produce when available and source additional products from other suitable growing regions.',
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      title: 'Buyer-Specific Requirements',
      desc: 'Product selection, grading, packaging and documentation are considered according to the agreed order and destination requirements.',
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: 'Supply Coordination',
      desc: 'We work towards coordinating sourcing and shipment arrangements in line with the buyer’s requirements and applicable regulations.',
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
  ];

  const buyerChecklist = [
    {
      step: '01',
      title: 'Destination Market',
      desc: 'Target country, port or airport of entry, and any destination-country phytosanitary or compliance requirements.',
    },
    {
      step: '02',
      title: 'Product List & Specifications',
      desc: 'Desired vegetable varieties, preferred grading, sizing, and specific packaging standards.',
    },
    {
      step: '03',
      title: 'Required Quantities',
      desc: 'Volume per shipment (air freight or sea reefer container loads) and estimated order frequency.',
    },
    {
      step: '04',
      title: 'Preferred Delivery Schedule',
      desc: 'Target dispatch window, required shelf life at arrival, and planned delivery timeline.',
    },
  ];

  const internationalBuyers = [
    'Importers',
    'Distributors',
    'Wholesalers',
    'Retailers',
    'Food Businesses',
  ];

  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    'Hello firstQuality, I would like to enquire about your Indian Vegetable Export services and discuss international sourcing requirements.'
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header enquireUrl="#enquire" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 sm:pt-36 pb-14 sm:pb-20 bg-gradient-to-b from-[#eaf6ee] via-[#f4faf5] to-white border-b border-gray-100">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-50/70 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-[#15803d] text-xs font-bold uppercase tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse" />
                GLOBAL EXPORTS
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
                Indian Produce. Carefully Sourced.{' '}
                <span className="text-[#15803d]">Globally Connected.</span>
              </h1>

              <div className="w-16 h-1.5 bg-[#f97316] rounded-full mb-6" />

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                At <span className="font-semibold text-gray-900">firstQuality</span>, we aim to connect international buyers with carefully selected fresh vegetables from India.
              </p>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                We source produce from Kerala and other major growing regions across India, giving preference to locally grown vegetables whenever available. By working around seasonal availability and buyer requirements, we aim to offer a diverse range of Indian vegetables for international markets.
              </p>

              <p className="text-sm sm:text-base font-medium text-emerald-900/90 leading-relaxed mb-8">
                Our focus is on responsible sourcing, careful product selection, quality-conscious handling and coordinated supply arrangements.
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <a
                  href="#enquire"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-bold text-white bg-[#15803d] hover:bg-[#166534] active:scale-95 transition-all shadow-md hover:shadow-lg"
                >
                  Enquire About Exports
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
                  WhatsApp Export Desk
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Our Export Product Range */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
                GLOBAL COMMODITIES
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2 mb-3">
                Our Export Product Range
              </h2>
              <div className="w-12 h-1 bg-[#f97316] rounded-full mx-auto mb-4" />
              <p className="text-sm sm:text-base text-gray-600">
                Sourcing India’s diverse vegetable harvests for international distributors and markets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10">
              {exportRange.map((item, idx) => (
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
                    <span>Export Feasible</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Regulatory and Seasonal Disclaimer Callout */}
            <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 flex items-start gap-3.5">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs sm:text-sm italic leading-relaxed text-amber-900">
                Products, quantities and export feasibility are subject to seasonal availability, destination-country regulations and buyer specifications.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Our Approach to Quality */}
        <section className="py-16 sm:py-24 bg-[#f8faf8] border-y border-gray-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
                QUALITY COMMITMENT
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2 mb-3">
                Our Approach to Quality
              </h2>
              <div className="w-12 h-1 bg-[#f97316] rounded-full mx-auto mb-4" />
              <p className="text-sm sm:text-base text-gray-600">
                Disciplined grading, ethical sourcing, and end-to-end supply coordination tailored to destination requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {qualityPillars.map((pillar, idx) => (
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

        {/* Section: Working with International Buyers */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
                GLOBAL PARTNERSHIPS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2 mb-3">
                Working with International Buyers
              </h2>
              <div className="w-12 h-1 bg-[#f97316] rounded-full mx-auto mb-4" />
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                We welcome enquiries from importers, distributors, wholesalers, retailers and food businesses seeking Indian vegetable sourcing opportunities.
              </p>

              {/* Pills for buyer types */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {internationalBuyers.map((buyer, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-emerald-50 border border-emerald-200 text-[#15803d]"
                  >
                    ✓ {buyer}
                  </span>
                ))}
              </div>
            </div>

            {/* Buyer Checklist Process */}
            <div className="bg-[#fbfdfb] p-6 sm:p-10 rounded-3xl border border-gray-200/80">
              <div className="max-w-2xl mx-auto text-center mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  What to Share for Your Assessment
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Share your destination market, product list, required quantities and preferred delivery schedule so we can assess availability and discuss suitable arrangements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {buyerChecklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-gray-100 shadow-2xs flex flex-col justify-start"
                  >
                    <span className="text-2xl font-black text-[#15803d]/40 mb-2 font-mono">
                      {item.step}
                    </span>
                    <h4 className="text-base font-bold text-gray-900 mb-1.5">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section: Let’s Discuss Your Export Requirements (Enquiry Form) */}
        <section id="enquire" className="py-16 sm:py-24 bg-gradient-to-b from-[#f8faf8] to-white border-t border-gray-200/70 scroll-mt-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-gray-200/90 shadow-xl shadow-emerald-950/5">
              <div className="text-center max-w-xl mx-auto mb-10">
                <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
                  INTERNATIONAL SOURCING
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-3">
                  Let’s Discuss Your Export Requirements
                </h2>
                <div className="w-12 h-1 bg-[#f97316] rounded-full mx-auto mb-4" />
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Connect with firstQuality to explore product availability, sourcing options and potential export arrangements.
                </p>
              </div>

              {/* Direct Export Contact Form */}
              <ContactForm defaultEnquiryType="export" buttonText="Enquire About Exports" />

              {/* Direct Contacts Footer Strip */}
              <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="block text-xs text-gray-500 font-medium">Export Phone</span>
                  <a href={`tel:${settings.phone}`} className="text-sm font-bold text-gray-900 hover:text-[#15803d] transition-colors">
                    {settings.phone}
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="block text-xs text-gray-500 font-medium">WhatsApp Export Desk</span>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors">
                    Chat on WhatsApp
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="block text-xs text-gray-500 font-medium">Export Email Desk</span>
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
