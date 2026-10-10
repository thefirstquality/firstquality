import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSiteSettings } from '@/services/contentService';

export const metadata: Metadata = {
  title: 'Terms & Conditions | firstQuality',
  description: 'Terms and conditions governing fresh vegetable supply, wholesale orders, and service usage with firstQuality.',
};
export const instant = false;

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Terms & Conditions
          </h1>
          <p className="text-xs text-gray-500 mb-8 uppercase tracking-wider">
            Effective Date: January 2024
          </p>

          <div className="prose prose-emerald max-w-none text-gray-700 space-y-6 leading-relaxed">
            <p>
              Welcome to <strong>firstQuality</strong>. By accessing our website or placing orders for our fresh produce, cut vegetables, and kitchen essentials, you agree to comply with the terms and conditions outlined below.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6">1. Produce Freshness and Sourcing</h2>
            <p>
              Because our vegetables are freshly harvested and perishable, items are subject to seasonal weather conditions and farmgate availability. We make every effort to supply the exact ordered varieties and weights.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6">2. Commercial & Wholesale Orders</h2>
            <p>
              Wholesale contracts for restaurants, hotels, and retailers are confirmed upon advance agreement of daily quantities and rate cards. Any discrepancy in produce grading or quantity must be reported upon delivery inspection.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6">3. Return and Replacement Policy</h2>
            <p>
              If any delivered vegetable item fails to meet our strict quality criteria, customers are entitled to an immediate replacement or credit note on their next morning order.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6">4. Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of Kerala, India. For legal or commercial inquiries, contact{' '}
              <a href={`mailto:${settings.email}`} className="text-[#15803d] font-semibold underline">
                {settings.email}
              </a>.
            </p>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
