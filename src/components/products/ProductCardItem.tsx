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
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="whitespace-nowrap">Order via WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

export default ProductCardItem;
