import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSiteSettings } from '@/services/contentService';

export const metadata: Metadata = {
  title: 'Privacy Policy | firstQuality',
  description: 'Privacy Policy and data protection terms for firstQuality customers and partners.',
};
export const instant = false;

export default async function PrivacyPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 pb-20">
        <div className="pt-32 sm:pt-36 pb-12 bg-gradient-to-b from-[#eaf6ee] to-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Last Updated: January 2026
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="prose prose-emerald max-w-none text-gray-700 space-y-6 leading-relaxed">
            <p>
              At <strong>firstQuality</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), we respect your privacy and are committed to protecting any personal information you provide when visiting our website or ordering our fresh vegetable sourcing and supply services in Kerala.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6">1. Information We Collect</h2>
            <p>
              When you submit an enquiry, request a business quotation, or subscribe to updates, we collect personal details including your name, business name, phone number, email address, and delivery location details.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To fulfill vegetable supply orders and manage deliveries across Kerala.</li>
              <li>To provide quotation sheets, price lists, and availability updates.</li>
              <li>To respond to customer support enquiries via phone or WhatsApp.</li>
              <li>To maintain compliance with food safety and agricultural sourcing regulations.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-6">3. Data Sharing and Protection</h2>
            <p>
              We do not sell, rent, or trade your personal information to third-party advertisers. Your information is accessed only by authorized logistics and supply coordination personnel.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6">4. Contacting Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, please contact us at{' '}
              <a href={`mailto:${settings.email}`} className="text-[#15803d] font-semibold underline">
                {settings.email}
              </a>{' '}
              or write to our registered location in {settings.address}.
            </p>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
