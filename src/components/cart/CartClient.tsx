'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { WhatsAppOrderModal } from '@/components/cart/WhatsAppOrderModal';

interface CartClientProps {
  whatsappNumber: string;
}

export function CartClient({ whatsappNumber }: CartClientProps) {
  const { items, removeFromCart, clearCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderSentNotification, setOrderSentNotification] = useState(false);

  const handleOrderSuccess = () => {
    setOrderSentNotification(true);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div className="p-8 sm:p-14 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-5">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 text-[#15803d] flex items-center justify-center text-4xl shadow-inner border border-emerald-100">
            🛒
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Your Vegetable Cart is Empty
            </h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto mt-2 leading-relaxed">
              Explore our farm-fresh vegetables, harvested directly from Kerala partner farms, and add items to your cart.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-[#0e3d23] hover:bg-[#15803d] transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <span>Explore Fresh Produce Catalog</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-28 lg:pb-16">
      {orderSentNotification && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#15803d] text-sm flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">✓</span>
            <span className="font-semibold">
              WhatsApp message prepared! Our farm desk will respond to your enquiry shortly.
            </span>
          </div>
          <button
            onClick={() => setOrderSentNotification(false)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
          >
            ✕ Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                Selected Produce
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <button
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear Cart</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 shadow-xs hover:shadow-sm transition-all"
              >
                {/* Product Thumbnail */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                  <Image
                    src={item.image_url || '/images/cat-fresh-vegetables.jpg'}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 64px, 80px"
                    unoptimized={item.image_url?.startsWith('/images/')}
                  />
                </div>

                {/* Product Details */}
                <div className="min-w-0 flex-1 pr-1">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate group-hover:text-[#15803d] transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {item.unit && (
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] sm:text-[11px] font-semibold">
                        {item.unit}
                      </span>
                    )}
                    {item.price_text && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#15803d] text-[10px] sm:text-[11px] font-bold">
                        {item.price_text}
                      </span>
                    )}
                    <span className="hidden sm:inline-flex items-center text-[11px] text-gray-400 font-medium">
                      • Farm Fresh
                    </span>
                  </div>
                </div>

                {/* Remove Action */}
                <div className="flex items-center shrink-0">
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#15803d] hover:underline"
            >
              <span>← Add More Fresh Produce</span>
            </Link>
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">
              Daily harvest packing from Palakkad, Wayanad & Idukki
            </span>
          </div>
        </div>

        {/* Right Column: Order Summary & WhatsApp Action */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-gray-200/90 shadow-md space-y-5 sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base sm:text-lg font-extrabold text-gray-900">
                Order Summary
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#15803d]">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Selected Items</span>
                <span className="font-bold text-gray-900">{items.length}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Sourcing Origin</span>
                <span className="font-semibold text-emerald-800">Kerala Partner Farms</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Packing Standard</span>
                <span className="font-semibold text-gray-900">Hygienic & Food-Grade</span>
              </div>
            </div>

            {/* ORDER VIA WHATSAPP BUTTON */}
            <div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:py-4 rounded-2xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#1ebd59] active:scale-95 transition-all shadow-md hover:shadow-lg group text-center"
              >
                <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.541 1.767.813 2.796.813 3.183 0 5.769-2.587 5.77-5.766.001-3.187-2.575-5.8-5.77-5.8zm3.367 8.243c-.145.407-.743.747-1.026.793-.284.045-.65.076-1.05-.054-.354-.115-.815-.264-1.405-.519-2.474-1.074-4.085-3.6-4.208-3.766-.123-.166-1.002-1.332-1.002-2.54 0-1.209.633-1.804.858-2.049.226-.245.493-.306.657-.306.165 0 .33.002.474.009.153.007.358-.058.56.427.208.499.71 1.733.772 1.859.062.126.103.272.019.439-.082.166-.124.271-.247.416-.124.145-.26.325-.371.436-.124.123-.253.257-.109.504.144.247.64 1.055 1.373 1.708.944.841 1.741 1.102 1.988 1.226.247.123.391.103.535-.062.145-.166.619-.721.784-.969.165-.248.33-.207.556-.124.227.082 1.442.68 1.69 1.026z" />
                </svg>
                <span>Order via WhatsApp</span>
              </button>
              <p className="text-[11px] text-gray-500 text-center mt-2">
                Clicking will open order details form and prepare WhatsApp message
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-xl flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] text-gray-500 font-semibold block uppercase tracking-wider">
            Cart Total
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-[#0e3d23] truncate block">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 py-2.5 px-4 sm:px-5 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] shadow-md active:scale-95 transition-all shrink-0"
        >
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.128-.53-1.636-.687-2.73-2.336-2.812-2.446-.082-.11-1.025-1.36-1.025-2.593 0-1.233.649-1.84.88-2.091.231-.251.503-.314.671-.314.168 0 .336.002.483.009.155.008.363-.058.568.435.212.51.721 1.76.785 1.89.063.13.106.282.019.452-.086.17-.13.277-.257.424-.128.147-.268.328-.383.441-.128.125-.262.261-.113.518.15.257.666 1.096 1.431 1.777.986.877 1.817 1.15 2.074 1.278.257.127.408.106.56-.068.151-.174.648-.754.821-1.013.172-.258.345-.216.582-.128.237.087 1.504.709 1.763.838.258.13.431.194.495.302.064.108.064.629-.08 1.034z" />
          </svg>
          <span>Order via WhatsApp</span>
        </button>
      </div>

      {/* WhatsApp Order Form Modal */}
      <WhatsAppOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={items}
        whatsappNumber={whatsappNumber}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
}

export default CartClient;
