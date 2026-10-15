'use client';

import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import type { AboutSectionData, FeatureCard } from '@/types';
import { DEFAULT_ABOUT, DEFAULT_ABOUT_FEATURES } from '@/services/defaults';

export default function AdminAboutPage() {
  const [about, setAbout] = useState<AboutSectionData>(DEFAULT_ABOUT);
  const [features, setFeatures] = useState<FeatureCard[]>(DEFAULT_ABOUT_FEATURES);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const [aboutRes, featRes] = await Promise.all([
          fetch('/api/admin/content?table=about_section'),
          fetch('/api/admin/content?table=about_features'),
        ]);
        const aboutJson = await aboutRes.json();
        const featJson = await featRes.json();
        if (aboutJson?.data?.[0]) setAbout(aboutJson.data[0]);
        if (featJson?.data && featJson.data.length > 0) setFeatures(featJson.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAboutData();
  }, []);

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'about_section',
          id: about.id,
          data: about,
        }),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">About firstQuality Management</h1>
          <p className="text-xs text-gray-500 mt-1">
            Update company introduction, farmer field imagery, and 4 core principle cards
          </p>
        </div>

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#15803d] text-sm font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>About Section updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveAbout} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Company Story & Headings
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Section Badge
            </label>
            <input
              type="text"
              value={about.badge}
              onChange={(e) => setAbout({ ...about, badge: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Heading
            </label>
            <input
              type="text"
              value={about.heading}
              onChange={(e) => setAbout({ ...about, heading: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={4}
              value={about.description}
              onChange={(e) => setAbout({ ...about, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
            />
          </div>

          <ImageUploadField
            label="Farmer Working in Field Photo"
            value={about.image_url}
            onChange={(url, publicId) => {
              setAbout({
                ...about,
                image_url: url,
                image_public_id: publicId,
              });
            }}
            folder="firstquality/about"
          />

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-[#15803d] hover:bg-[#166534] shadow-md transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save About Section'}
            </button>
          </div>
        </form>

        {/* 4 Feature Cards */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900">
            4 Core Principles & Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-2">
                <span className="text-xs font-bold text-[#15803d] uppercase">{f.icon_name}</span>
                <h3 className="text-sm font-bold text-gray-900">{f.title}</h3>
                <p className="text-xs text-gray-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
