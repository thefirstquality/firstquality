import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CtaBannerProps {
  whatsappNumber?: string;
  whatsappUrl?: string;
}

export function CtaBanner({ whatsappNumber = '919876543100', whatsappUrl }: CtaBannerProps) {
  const finalWhatsappUrl =
    whatsappUrl ||
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      'Hello firstQuality, I would like to get a quote for fresh vegetable supply.'
    )}`;

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-gray-900">
      {/* Background Image of Fresh Carrots on Wood */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cta-carrots.jpg"
          alt="Fresh carrots background"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Floating Center Card */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 sm:p-12 text-center border border-white/60">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#15803d] uppercase">
            LET&apos;S WORK TOGETHER
          </span>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2 mb-3">
            Looking for Fresh Vegetable Supply?
          </h2>

          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
            Get in touch with us for retail, wholesale or business enquiries. Our team is ready to assist you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* WhatsApp CTA Button */}
            <a
              href={finalWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg text-sm font-semibold text-white bg-[#15803d] hover:bg-[#166534] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.128-.53-1.636-.687-2.73-2.336-2.812-2.446-.082-.11-1.025-1.36-1.025-2.593 0-1.233.649-1.84.88-2.091.231-.251.503-.314.671-.314.168 0 .336.002.483.009.155.008.363-.058.568.435.212.51.721 1.76.785 1.89.063.13.106.282.019.452-.086.17-.13.277-.257.424-.128.147-.268.328-.383.441-.128.125-.262.261-.113.518.15.257.666 1.096 1.431 1.777.986.877 1.817 1.15 2.074 1.278.257.127.408.106.56-.068.151-.174.648-.754.821-1.013.172-.258.345-.216.582-.128.237.087 1.504.709 1.763.838.258.13.431.194.495.302.064.108.064.629-.08 1.034z" />
              </svg>
              <span>Get a Quote on WhatsApp</span>
            </a>

            {/* Contact Us CTA Button */}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg text-sm font-semibold text-gray-800 bg-white border border-gray-300 hover:border-[#15803d] hover:bg-gray-50 shadow-sm transition-all duration-200 active:scale-95"
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
