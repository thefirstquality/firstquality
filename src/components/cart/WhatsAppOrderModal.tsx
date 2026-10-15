'use client';

import React, { useState } from 'react';
import type { CartItem } from '@/context/CartContext';

interface WhatsAppOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  whatsappNumber: string;
  onOrderSuccess?: () => void;
}

export function WhatsAppOrderModal({
  isOpen,
  onClose,
  items,
  whatsappNumber,
  onOrderSuccess,
}: WhatsAppOrderModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [enquiryType, setEnquiryType] = useState('retail');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const getEnquiryTypeLabel = (type: string) => {
    switch (type) {
      case 'wholesale':
        return 'Wholesale Supply (Retailers & Supermarkets)';
      case 'restaurant':
        return 'Restaurant & Catering Supply';
      case 'retail':
        return 'Retail / Household Delivery';
      case 'farmer':
        return 'Farmer Partnership / Sourcing';
      case 'other':
      default:
        return 'General Enquiry';
    }
  };

  const handleSendWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg('Please enter a valid WhatsApp or phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Build the list of ordered items
      const itemsListText = items
        .map(
          (item, index) =>
            `${index + 1}. *${item.name}* - ${item.quantity} ${
              item.unit ? `(${item.unit})` : 'pack'
            }${item.price_text ? ` [${item.price_text}]` : ''}`
        )
        .join('\n');

      // 2. Format the message for WhatsApp
      const message = `🌿 *NEW VEGETABLE ORDER - firstQuality*
━━━━━━━━━━━━━━━━━━━━
👤 *Customer Name:* ${fullName.trim()}
📱 *WhatsApp / Phone:* ${phone.trim()}
📋 *Enquiry Type:* ${getEnquiryTypeLabel(enquiryType)}
${deliveryAddress.trim() ? `📍 *Location / Address:* ${deliveryAddress.trim()}\n` : ''}
🛒 *ORDERED PRODUCE (${items.length} items, Total Qty: ${totalItemCount}):*
${itemsListText}
━━━━━━━━━━━━━━━━━━━━
_Please confirm item availability and delivery schedule. Thank you!_`;

      // 3. Save as enquiry to database in the background (so admin tracks order)
      try {
        await fetch('/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: fullName.trim(),
            businessName: deliveryAddress.trim() || undefined,
            phone: phone.trim(),
            email: `${phone.trim().replace(/[^0-9]/g, '') || 'whatsapp'}@order.firstquality.in`,
            enquiryType,
            message: `WhatsApp Cart Order:\n${itemsListText}\n\nDelivery Note: ${
              deliveryAddress.trim() || 'N/A'
            }`,
          }),
        });
      } catch (err) {
        console.warn('Background enquiry sync:', err);
      }

      // 4. Clean WhatsApp phone number (strip spaces, symbols, plus sign)
      const cleanWaNumber = (whatsappNumber || '919876543100').replace(/[^0-9]/g, '');

      // 5. Construct WhatsApp link and open
      const waUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');

      if (onOrderSuccess) {
        onOrderSuccess();
      }

      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0b2f1f] to-[#15803d] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-xl">
              💬
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight">Order via WhatsApp</h3>
              <p className="text-xs text-emerald-100/90">
                Confirm your details to send this order to our WhatsApp desk
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors text-sm font-bold"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              ⚠ {errorMsg}
            </div>
          )}

          {/* Cart Items Summary Snippet */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#15803d]">
              <span>Cart Items ({items.length} products)</span>
              <span>Total Qty: {totalItemCount}</span>
            </div>
            <div className="max-h-24 overflow-y-auto space-y-1 pr-1 text-xs text-gray-700">
              {items.map((it) => (
                <div key={it.id} className="flex justify-between items-center py-0.5">
                  <span className="font-medium truncate max-w-[220px]">{it.name}</span>
                  <span className="font-bold text-[#0e3d23] text-[11px]">
                    {it.quantity} {it.unit ? `× ${it.unit}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendWhatsApp} id="whatsapp-order-form" className="space-y-4">
            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Nair / Malabar Kitchen"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d] transition-all bg-white"
              />
            </div>

            {/* WhatsApp / Phone Number */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                WhatsApp or Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d] transition-all bg-white"
              />
            </div>

            {/* Enquiry Type (Exact match of Enquire Now form) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Enquiry Type <span className="text-red-500">*</span>
              </label>
              <select
                value={enquiryType}
                onChange={(e) => setEnquiryType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d] transition-all bg-white"
              >
                <option value="wholesale">Wholesale Supply (Retailers & Supermarkets)</option>
                <option value="restaurant">Restaurant & Catering Supply</option>
                <option value="retail">Retail / Household Delivery</option>
                <option value="farmer">Farmer Partnership / Sourcing</option>
                <option value="other">General Enquiry</option>
              </select>
            </div>

            {/* Delivery Location / Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Delivery Location / Special Instructions <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="e.g. Kochi / Palakkad, deliver before 9:00 AM"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d] transition-all bg-white resize-none"
              />
            </div>
          </form>
        </div>

        {/* Footer with WhatsApp Sending Button */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="whatsapp-order-form"
            disabled={isSubmitting || items.length === 0}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#1ebd59] active:scale-95 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {/* WhatsApp Logo SVG */}
            <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.541 1.767.813 2.796.813 3.183 0 5.769-2.587 5.77-5.766.001-3.187-2.575-5.8-5.77-5.8zm3.367 8.243c-.145.407-.743.747-1.026.793-.284.045-.65.076-1.05-.054-.354-.115-.815-.264-1.405-.519-2.474-1.074-4.085-3.6-4.208-3.766-.123-.166-1.002-1.332-1.002-2.54 0-1.209.633-1.804.858-2.049.226-.245.493-.306.657-.306.165 0 .33.002.474.009.153.007.358-.058.56.427.208.499.71 1.733.772 1.859.062.126.103.272.019.439-.082.166-.124.271-.247.416-.124.145-.26.325-.371.436-.124.123-.253.257-.109.504.144.247.64 1.055 1.373 1.708.944.841 1.741 1.102 1.988 1.226.247.123.391.103.535-.062.145-.166.619-.721.784-.969.165-.248.33-.207.556-.124.227.082 1.442.68 1.69 1.026z" />
            </svg>
            <span>{isSubmitting ? 'Opening WhatsApp...' : 'Send Order via WhatsApp'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WhatsAppOrderModal;
