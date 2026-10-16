'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import type { SiteSettings } from '@/types';

interface FooterProps {
  settings?: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  const address = settings?.address || 'Main Road Opp. Kaacheri Valappu Irinjalakuda, Thrissur 680121';
  const phone = settings?.phone || '+91 75939 33225';
  const emailContact = settings?.email || 'raju@thefirstquality.in';
  const footerDescription =
    settings?.footer_description ||
    'Fresh vegetables, quality first. We work directly with local farmers to bring fresh and nutritious produce to homes, retailers and businesses across Kerala.';
  const copyrightText =
    settings?.copyright_text?.replace('2024', '2026') ||
    '© 2026 firstQuality. All rights reserved.';

  return (
    <footer className="bg-[#0b2f1f] text-gray-300 pt-10 sm:pt-16 pb-8 sm:pb-10 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-row lg:justify-between lg:items-start gap-6 sm:gap-8 md:gap-12 lg:gap-8 xl:gap-12 pb-8 sm:pb-12 border-b border-emerald-900/60">
          {/* Col 1: Brand & Description */}
          <div className="w-full lg:w-auto lg:max-w-xs xl:max-w-sm space-y-3 sm:space-y-4">
            <Logo variant="light" />
            <p className="text-sm text-gray-300 leading-relaxed pt-1 sm:pt-2">
              {footerDescription}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="w-full lg:w-auto lg:min-w-[140px]">
            <button
              type="button"
              onClick={() => setQuickLinksOpen(!quickLinksOpen)}
              className="w-full flex items-center justify-between md:cursor-default md:pointer-events-none text-left text-sm font-bold text-white uppercase tracking-wider mb-2.5 md:mb-4"
              aria-expanded={quickLinksOpen}
            >
              <span>Quick Links</span>
              <span className="md:hidden text-green-400">
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    quickLinksOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            <ul
              className={`space-y-2.5 text-sm ${
                quickLinksOpen ? 'block pb-2' : 'hidden md:block'
              }`}
            >
              <li>
                <Link href="/" className="hover:text-green-400 transition-colors">
                  Home
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
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="w-full lg:w-auto lg:min-w-[140px]">
            <button
              type="button"
              onClick={() => setCompanyOpen(!companyOpen)}
              className="w-full flex items-center justify-between md:cursor-default md:pointer-events-none text-left text-sm font-bold text-white uppercase tracking-wider mb-2.5 md:mb-4"
              aria-expanded={companyOpen}
            >
              <span>Company</span>
              <span className="md:hidden text-green-400">
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    companyOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            <ul
              className={`space-y-2.5 text-sm ${
                companyOpen ? 'block pb-2' : 'hidden md:block'
              }`}
            >
              <li>
                <Link href="/about" className="hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="w-full lg:w-auto lg:max-w-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2.5 md:mb-4">
              Get In Touch
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
          </div>
        </div>

        {/* Bottom copyright & credits bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>{copyrightText}</p>
          <p className="text-xs text-gray-400">
            Crafted by{' '}
            <a
              href="https://www.ekodrix.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-green-300 font-semibold transition-colors underline underline-offset-4 decoration-emerald-500/50 hover:decoration-green-300"
            >
              Ekodrix
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
