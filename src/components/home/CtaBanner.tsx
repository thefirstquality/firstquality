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
              className="w-full sm:w-auto h-[42px] inline-flex items-center justify-center gap-2 px-4 sm:px-5 rounded-lg text-xs font-semibold text-white bg-[#0e3d23] hover:bg-[#15803d] shadow-sm transition-all duration-200 active:scale-95 text-center"
            >
              <svg className="w-4.5 h-4.5 text-[#25D366] fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
