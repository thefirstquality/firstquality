import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSiteSettings } from '@/services/contentService';
import { ContactForm } from '@/components/ui/ContactForm';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Contact Us | firstQuality Kerala',
  description:
    'Contact firstQuality for fresh vegetable sourcing inquiries, restaurant orders, farmer partnerships, or customer assistance.',
};
export const instant = false;

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 pt-28">
        {/* Banner */}
        <div className="py-16 bg-gradient-to-b from-[#eaf6ee] to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
              GET IN TOUCH
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mt-2 mb-3">
              Contact Us
            </h1>
            <div className="w-14 h-1 bg-[#f97316] rounded-full mb-4" />
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
              Have questions about daily vegetable supplies, restaurant deliveries, or wholesale rates? Our Kerala supply coordination team is here to assist you.
            </p>
          </div>
        </div>

        {/* Contact Info & Form */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Left Column: Direct Contact Details */}
              <div className="lg:col-span-5 space-y-8">
                <div className="p-8 rounded-3xl bg-[#0b2f1f] text-white shadow-xl space-y-6">
                  <h2 className="text-2xl font-bold text-white">firstQuality Headquarters</h2>
                  <p className="text-emerald-100/90 text-sm leading-relaxed">
                    Connecting local Kerala farming belts with dependable delivery networks.
                  </p>

                  <div className="space-y-4 pt-4 border-t border-emerald-900 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-800/80 flex items-center justify-center text-green-300 flex-shrink-0">
                        📍
                      </div>
                      <div>
                        <div className="font-semibold text-white">Our Address</div>
                        <div className="text-emerald-200">{settings.address}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-800/80 flex items-center justify-center text-green-300 flex-shrink-0">
                        📞
                      </div>
                      <div>
                        <div className="font-semibold text-white">Call Directly</div>
                        <a href={`tel:${settings.phone}`} className="text-emerald-200 hover:text-white">
                          {settings.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-800/80 flex items-center justify-center text-green-300 flex-shrink-0">
                        ✉
                      </div>
                      <div>
                        <div className="font-semibold text-white">Email Us</div>
                        <a href={`mailto:${settings.email}`} className="text-emerald-200 hover:text-white">
                          {settings.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <a
                      href={buildWhatsAppUrl(settings.whatsapp_number, 'Hello firstQuality, I would like to inquire about your fresh vegetable supply.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-[#0b2f1f] bg-green-400 hover:bg-green-300 transition-all shadow-md"
                    >
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-[#f8faf8] border border-gray-200/60">
                  <h3 className="text-base font-bold text-gray-900 mb-2">Operating Hours</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Procurement & Supply: <strong>5:00 AM – 8:00 PM</strong> (All 7 Days)
                  </p>
                  <p className="text-xs text-gray-500">
                    Harvested morning produce dispatched on schedule across Kerala routes.
                  </p>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="lg:col-span-7 bg-[#fbfdfb] p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                <p className="text-sm text-gray-600 mb-8">
                  Fill in your requirements below and our team will get in touch with product availability and pricing.
                </p>

                <ContactForm defaultEnquiryType="other" buttonText="Send Message" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
