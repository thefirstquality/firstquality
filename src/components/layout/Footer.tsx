'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import type { SiteSettings } from '@/types';

interface FooterProps {
  settings?: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      setStatus('error');
      return;
    }

    try {
      setStatus('loading');
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to subscribe');
      }

      setStatus('success');
      setEmail('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Subscription failed';
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  const address = settings?.address || 'Vyppinrick, Kerala, India';
  const phone = settings?.phone || '+91 98765 43100';
  const emailContact = settings?.email || 'info@firstquality.in';
  const footerDescription =
    settings?.footer_description ||
    'Fresh vegetables, quality first. We work directly with local farmers to bring fresh and nutritious produce to homes, retailers and businesses across Kerala.';
  const copyrightText = settings?.copyright_text || '© 2024 firstQuality. All rights reserved.';

  return (
    <footer className="bg-[#0b2f1f] text-gray-300 pt-16 pb-10 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-emerald-900/60">
          {/* Col 1: Brand & Description (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo variant="light" />
            <p className="text-sm text-gray-300 leading-relaxed max-w-sm pt-2">
              {footerDescription}
            </p>
          </div>

          {/* Col 2: Quick Links (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-green-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/farms" className="hover:text-green-400 transition-colors">
                  Our Farms
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Our Products (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Our Products
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products/fresh-vegetables" className="hover:text-green-400 transition-colors">
                  Fresh Vegetables
                </Link>
              </li>
              <li>
                <Link href="/products/fresh-cut-vegetables" className="hover:text-green-400 transition-colors">
                  Fresh Cut Vegetables
                </Link>
              </li>
              <li>
                <Link href="/products/vegetable-combo-kits" className="hover:text-green-400 transition-colors">
                  Vegetable Combo Kits
                </Link>
              </li>
              <li>
                <Link href="/products/kitchen-essentials" className="hover:text-green-400 transition-colors">
                  Kitchen Essentials
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Us (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${phone}`} className="hover:text-green-400 transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${emailContact}`} className="hover:text-green-400 transition-colors">
                  {emailContact}
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-4">
              <a
                href={settings?.whatsapp_url || 'https://wa.me/919876543100'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-900/80 flex items-center justify-center text-gray-200 hover:text-white hover:bg-green-600 transition-all"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.128-.53-1.636-.687-2.73-2.336-2.812-2.446-.082-.11-1.025-1.36-1.025-2.593 0-1.233.649-1.84.88-2.091.231-.251.503-.314.671-.314.168 0 .336.002.483.009.155.008.363-.058.568.435.212.51.721 1.76.785 1.89.063.13.106.282.019.452-.086.17-.13.277-.257.424-.128.147-.268.328-.383.441-.128.125-.262.261-.113.518.15.257.666 1.096 1.431 1.777.986.877 1.817 1.15 2.074 1.278.257.127.408.106.56-.068.151-.174.648-.754.821-1.013.172-.258.345-.216.582-.128.237.087 1.504.709 1.763.838.258.13.431.194.495.302.064.108.064.629-.08 1.034z" />
                </svg>
              </a>
              <a
                href={settings?.instagram_url || 'https://instagram.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-900/80 flex items-center justify-center text-gray-200 hover:text-white hover:bg-green-600 transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href={settings?.facebook_url || 'https://facebook.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-900/80 flex items-center justify-center text-gray-200 hover:text-white hover:bg-green-600 transition-all"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>
              <a
                href={settings?.youtube_url || 'https://youtube.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-900/80 flex items-center justify-center text-gray-200 hover:text-white hover:bg-green-600 transition-all"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 5: Subscribe for Updates (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Subscribe for Updates
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              Get the latest updates on our products and farm activities.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#15803d] hover:bg-[#166534] active:scale-98 transition-all disabled:opacity-50"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>

            {status === 'success' && (
              <p className="text-xs text-green-400 mt-2 font-medium">
                ✓ Thank you for subscribing!
              </p>
            )}
            {status === 'error' && (
              <p className="text-xs text-rose-400 mt-2 font-medium">
                {errorMessage}
              </p>
            )}
          </div>
        </div>

        {/* Bottom copyright & legal bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>{copyrightText}</p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-green-400 transition-colors">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-green-400 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
