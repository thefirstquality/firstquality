'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { enquiryFormSchema, type EnquiryFormValues } from '@/lib/validations';

interface ContactFormProps {
  defaultEnquiryType?: 'retail' | 'wholesale' | 'export' | 'restaurant' | 'household' | 'farmer' | 'other';
  buttonText?: string;
}

export function ContactForm({
  defaultEnquiryType = 'wholesale',
  buttonText = 'Send Message',
}: ContactFormProps) {
  const [serverState, setServerState] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
  }>({ status: 'idle' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      enquiryType: defaultEnquiryType,
      fullName: '',
      businessName: '',
      phone: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: EnquiryFormValues) => {
    setServerState({ status: 'loading' });

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to submit form');
      }

      setServerState({
        status: 'success',
        message: 'Thank you! Your message has been received. Our team will contact you shortly.',
      });
      reset();
    } catch (err: unknown) {
      setServerState({
        status: 'error',
        message: err instanceof Error ? err.message : 'An error occurred while submitting.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverState.status === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#15803d] text-sm font-medium">
          ✓ {serverState.message}
        </div>
      )}

      {serverState.status === 'error' && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
          ⚠ {serverState.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="John Doe"
            {...register('fullName')}
            className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d] transition-all ${
              errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-gray-200 bg-white'
            }`}
          />
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Business Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Business / Company Name (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Malabar Spice Kitchen / Global Imports LLC"
            {...register('businessName')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d] transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Phone Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone / WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="+91 75939 33225"
            {...register('phone')}
            className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d] transition-all ${
              errors.phone ? 'border-red-400 bg-red-50/20' : 'border-gray-200 bg-white'
            }`}
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d] transition-all ${
              errors.email ? 'border-red-400 bg-red-50/20' : 'border-gray-200 bg-white'
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Enquiry Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Enquiry Type <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <select
          {...register('enquiryType')}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d] transition-all"
        >
          <option value="wholesale">Wholesale Supply (Retailers & Supermarkets)</option>
          <option value="export">International Export Enquiry</option>
          <option value="restaurant">Restaurant & Catering Supply</option>
          <option value="retail">Retail / Household Delivery</option>
          <option value="farmer">Farmer Partnership / Sourcing</option>
          <option value="other">General Enquiry</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Your Requirement or Message <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <textarea
          rows={4}
          placeholder="Please describe your requirements, volume estimate, frequency, or delivery location in Kerala..."
          {...register('message')}
          className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d] transition-all ${
            errors.message ? 'border-red-400 bg-red-50/20' : 'border-gray-200 bg-white'
          }`}
        />
        {errors.message && (
          <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={serverState.status === 'loading'}
        className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-[#15803d] hover:bg-[#166534] active:scale-95 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
      >
        {serverState.status === 'loading' ? 'Submitting...' : buttonText}
      </button>
    </form>
  );
}

export default ContactForm;
