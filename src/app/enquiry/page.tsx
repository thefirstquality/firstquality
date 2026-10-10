import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSiteSettings } from '@/services/contentService';
import { ContactForm } from '@/components/ui/ContactForm';

export const metadata: Metadata = {
  title: 'Business & Wholesale Vegetable Enquiry | firstQuality Kerala',
  description:
    'Looking for consistent fresh vegetable supply for your restaurant, catering, or supermarket business? Request custom wholesale quotations from firstQuality.',
};

export default async function EnquiryPage() {
  const settings = await getSiteSettings();

  const b2bBenefits = [
    {
      title: 'Daily Dawn Delivery',
      desc: 'Sorted, weighed and packed vegetables delivered before your kitchen prep starts.',
    },
    {
      title: 'Stable Wholesale Pricing',
      desc: 'Transparent contracts and volume-based discounts directly tied to farmgate rates.',
    },
    {
      title: 'Strict Quality Sorting',
      desc: 'Zero rotten or sub-standard produce. A-Grade sorting with guaranteed return/replacement policy.',
    },
    {
      title: 'Custom Pre-cut Options',
      desc: 'Save chef preparation time with machine-peeled, sliced, and diced vegetable packs.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 pt-28">
        {/* Banner */}
        <div className="py-16 bg-gradient-to-b from-[#eaf6ee] to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
              B2B & WHOLESALE SOURCING
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mt-2 mb-3">
              Business & Wholesale Enquiry
            </h1>
            <div className="w-14 h-1 bg-[#f97316] rounded-full mb-4" />
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
              Serving Kerala’s premier restaurants, caterers, hotels, and retail stores with guaranteed fresh vegetables straight from partnered farms.
            </p>
          </div>
        </div>

        {/* B2B Value Highlights */}
        <section className="py-12 bg-[#f8faf8] border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {b2bBenefits.map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#15803d] flex items-center justify-center font-bold text-sm mb-3">
                    {i + 1}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enquiry Form */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#fbfdfb] p-8 sm:p-12 rounded-3xl border border-gray-200/80 shadow-md">
              <div className="text-center max-w-xl mx-auto mb-10">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  Request a Custom Quotation
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Tell us about your business and daily or weekly vegetable requirements. We will prepare a customized supply proposal.
                </p>
              </div>

              <ContactForm defaultEnquiryType="wholesale" buttonText="Submit Business Enquiry" />
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
