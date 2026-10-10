'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import type { HeroSectionData, HeroBenefit } from '@/types';
import { DEFAULT_HERO, DEFAULT_HERO_BENEFITS } from '@/services/defaults';

export default function AdminHeroPage() {
  const [hero, setHero] = useState<HeroSectionData>(DEFAULT_HERO);
  const [benefits, setBenefits] = useState<HeroBenefit[]>(DEFAULT_HERO_BENEFITS);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const [heroRes, benRes] = await Promise.all([
          fetch('/api/admin/content?table=hero_section'),
          fetch('/api/admin/content?table=hero_benefits'),
        ]);
        const heroJson = await heroRes.json();
        const benJson = await benRes.json();
        if (heroJson?.data?.[0]) setHero(heroJson.data[0]);
        if (benJson?.data && benJson.data.length > 0) setBenefits(benJson.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchHeroData();
  }, []);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'hero_section',
          id: hero.id,
          data: hero,
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Hero Section & Benefits</h1>
            <p className="text-xs text-gray-500 mt-1">
              Configure the top banner, primary copy, and 4 floating highlight cards
            </p>
          </div>
        </div>

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#15803d] text-sm font-semibold">
            ✓ Hero settings saved successfully! Changes are updated live on the homepage.
          </div>
        )}

        <form onSubmit={handleSaveHero} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Primary Copy & Typography
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Top Badge
            </label>
            <input
              type="text"
              value={hero.badge}
              onChange={(e) => setHero({ ...hero, badge: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Headline Line 1
              </label>
              <input
                type="text"
                value={hero.headline_line1}
                onChange={(e) => setHero({ ...hero, headline_line1: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Headline Line 2
              </label>
              <input
                type="text"
                value={hero.headline_line2}
                onChange={(e) => setHero({ ...hero, headline_line2: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Highlight (Green)
              </label>
              <input
                type="text"
                value={hero.headline_highlight}
                onChange={(e) => setHero({ ...hero, headline_highlight: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Description Paragraph
            </label>
            <textarea
              rows={3}
              value={hero.description}
              onChange={(e) => setHero({ ...hero, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Primary Button Label
              </label>
              <input
                type="text"
                value={hero.primary_cta_text}
                onChange={(e) => setHero({ ...hero, primary_cta_text: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Secondary Button Label
              </label>
              <input
                type="text"
                value={hero.secondary_cta_text}
                onChange={(e) => setHero({ ...hero, secondary_cta_text: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
              />
            </div>
          </div>

          <ImageUploadField
            label="Hero Background Vegetable Crate Image"
            value={hero.background_image_url}
            onChange={(url, publicId) => {
              setHero({
                ...hero,
                background_image_url: url,
                background_public_id: publicId,
              });
            }}
            folder="firstquality/hero"
          />

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-[#15803d] hover:bg-[#166534] shadow-md transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Hero Section'}
            </button>
          </div>
        </form>

        {/* 4 Benefits Overview */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900">
            4 Floating Benefit Highlights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((b) => (
              <div key={b.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#15803d] flex items-center justify-center text-xs font-bold mb-2">
                    {b.icon_name}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{b.title}</h3>
                  <p className="text-xs text-gray-600">{b.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
