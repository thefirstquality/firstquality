import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

interface CtaBannerProps {
  whatsappNumber?: string;
  whatsappUrl?: string;
}

export function CtaBanner({ whatsappNumber, whatsappUrl }: CtaBannerProps) {
  const finalWhatsappUrl =
    buildWhatsAppUrl(
      whatsappNumber,
      'Hello firstQuality, I would like to get a quote for fresh vegetable supply.'
    );

  return (
    <section className="relative py-8 sm:py-12 lg:py-14 min-h-[240px] sm:min-h-[280px] flex items-center justify-center overflow-hidden bg-gray-100">
      {/* Background Image of Fresh Carrots - Panoramic Landscape */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cta-carrots.jpg"
          alt="Fresh carrots background"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Floating Centered Landscape Card */}
      <div className="relative z-10 w-full max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-5 sm:p-6 text-center border border-white/80">
          <span className="text-[10px] font-bold tracking-wider text-[#15803d] uppercase block mb-1">
            LET&apos;S WORK TOGETHER
          </span>

          <h2 className="text-base sm:text-lg lg:text-xl font-extrabold text-gray-900 tracking-tight mb-1">
            Looking for Fresh Vegetable Supply?
          </h2>

          <p className="text-[11px] sm:text-xs text-gray-600 max-w-md mx-auto mb-3.5 sm:mb-4 leading-relaxed">
            Get in touch with us for retail, wholesale or business enquiries. Our team is ready to assist you.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 w-full max-w-sm sm:max-w-none mx-auto">
            {/* WhatsApp CTA Button (Top on mobile) */}
            <a
              href={finalWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto h-[42px] inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 rounded-lg text-xs font-semibold text-white bg-[#0e3d23] hover:bg-[#15803d] shadow-sm transition-all duration-200 active:scale-95 text-center"
            >
              <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.128-.53-1.636-.687-2.73-2.336-2.812-2.446-.082-.11-1.025-1.36-1.025-2.593 0-1.233.649-1.84.88-2.091.231-.251.503-.314.671-.314.168 0 .336.002.483.009.155.008.363-.058.568.435.212.51.721 1.76.785 1.89.063.13.106.282.019.452-.086.17-.13.277-.257.424-.128.147-.268.328-.383.441-.128.125-.262.261-.113.518.15.257.666 1.096 1.431 1.777.986.877 1.817 1.15 2.074 1.278.257.127.408.106.56-.068.151-.174.648-.754.821-1.013.172-.258.345-.216.582-.128.237.087 1.504.709 1.763.838.258.13.431.194.495.302.064.108.064.629-.08 1.034z" />
              </svg>
              <span>Get a Quote on WhatsApp</span>
            </a>

            {/* Contact Us CTA Button (Bottom on mobile) */}
            <Link
              href="/contact"
              className="w-full sm:w-auto h-[42px] inline-flex items-center justify-center px-4 sm:px-5 rounded-lg text-xs font-semibold text-[#0e3d23] bg-white border border-[#0e3d23]/40 hover:border-[#0e3d23] hover:bg-gray-50 shadow-2xs transition-all duration-200 active:scale-95 text-center box-border"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaBanner;
