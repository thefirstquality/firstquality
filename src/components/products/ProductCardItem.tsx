'use client';

import React from 'react';
import Image from 'next/image';
import type { ProductItem } from '@/types';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

interface ProductCardItemProps {
  item: ProductItem;
  categoryImageUrl?: string;
  whatsappNumber?: string;
}

export function ProductCardItem({
  item,
  categoryImageUrl,
  whatsappNumber,
}: ProductCardItemProps) {
  return (
    <div className="group bg-[#fbfdfb] hover:bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div>
        <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
          <Image
            src={item.image_url || categoryImageUrl || '/images/cat-fresh-vegetables.jpg'}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized={item.image_url?.startsWith('/images/')}
          />
          <div className="absolute top-2 right-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                item.in_stock ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}
            >
              {item.in_stock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        <div className="p-5 space-y-2">
          <h4 className="text-base font-bold text-gray-900 group-hover:text-[#15803d] transition-colors line-clamp-1">
            {item.name}
          </h4>

          <div className="flex items-center gap-2 text-xs">
            {item.unit && (
              <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold text-[11px]">
                {item.unit}
              </span>
            )}
            {item.price_text && (
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#15803d] font-bold text-[11px]">
                {item.price_text}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Product Action: Order via WhatsApp */}
      <div className="p-2.5 pt-0 sm:p-5 sm:pt-0">
        <a
          href={buildWhatsAppUrl(
            whatsappNumber,
            `Hello firstQuality, I would like to order: ${item.name}${item.unit ? ` (${item.unit})` : ''}${item.price_text ? ` - ${item.price_text}` : ''}. Please share availability and delivery details.`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-3 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] transition-all duration-200 shadow-xs sm:shadow-sm hover:shadow-md active:scale-95 group/wa"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.128-.53-1.636-.687-2.73-2.336-2.812-2.446-.082-.11-1.025-1.36-1.025-2.593 0-1.233.649-1.84.88-2.091.231-.251.503-.314.671-.314.168 0 .336.002.483.009.155.008.363-.058.568.435.212.51.721 1.76.785 1.89.063.13.106.282.019.452-.086.17-.13.277-.257.424-.128.147-.268.328-.383.441-.128.125-.262.261-.113.518.15.257.666 1.096 1.431 1.777.986.877 1.817 1.15 2.074 1.278.257.127.408.106.56-.068.151-.174.648-.754.821-1.013.172-.258.345-.216.582-.128.237.087 1.504.709 1.763.838.258.13.431.194.495.302.064.108.064.629-.08 1.034z" />
          </svg>
          <span className="whitespace-nowrap">Order via WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

export default ProductCardItem;
