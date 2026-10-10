import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DEFAULT_SITE_SETTINGS } from '@/services/defaults';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center pt-32 pb-20 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-[#15803d] text-3xl font-extrabold mx-auto shadow-sm">
            404
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Page Not Found
          </h1>

          <p className="text-gray-600 text-sm leading-relaxed">
            The page you are looking for may have been moved, deleted, or does not exist. Let&apos;s get you back to our fresh produce.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#15803d] hover:bg-[#166534] shadow-md transition-all active:scale-95"
            >
              Back to Home
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 transition-all"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </main>

      <Footer settings={DEFAULT_SITE_SETTINGS} />
    </div>
  );
}
