'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import type { HeroSectionData, HeroBenefit } from '@/types';
import { DEFAULT_HERO, DEFAULT_HERO_BENEFITS } from '@/services/defaults';
import { IconRenderer } from '@/components/ui/IconRenderer';

const AVAILABLE_ICONS = [
  { value: 'leaf', label: 'Leaf / Freshness' },
  { value: 'shield-check', label: 'Shield / Quality' },
  { value: 'truck', label: 'Truck / Logistics' },
  { value: 'users', label: 'Users / Farmers' },
  { value: 'sprout', label: 'Sprout / Growth' },
  { value: 'map-pin', label: 'Map Pin / Local' },
  { value: 'award', label: 'Award / Premium' },
  { value: 'check', label: 'Checkmark' },
];

export default function AdminHeroPage() {
  const [hero, setHero] = useState<HeroSectionData>(DEFAULT_HERO);
  const [benefits, setBenefits] = useState<HeroBenefit[]>(DEFAULT_HERO_BENEFITS);
  const [loading, setLoading] = useState(true);
  const [savingHero, setSavingHero] = useState(false);
  const [savingBenefits, setSavingBenefits] = useState(false);
  const [heroSuccess, setHeroSuccess] = useState(false);
  const [benefitsSuccess, setBenefitsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        const [heroRes, benRes] = await Promise.all([
          fetch('/api/admin/content?table=hero_section'),
          fetch('/api/admin/content?table=hero_benefits'),
        ]);

        const heroJson = await heroRes.json();
        const benJson = await benRes.json();

        if (heroJson?.data?.[0]) {
          setHero(heroJson.data[0]);
        }
        if (benJson?.data && benJson.data.length > 0) {
          setBenefits(benJson.data);
        }
      } catch (e: unknown) {
        console.error('Failed to load hero section data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHero(true);
    setHeroSuccess(false);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'hero_section',
          id: hero.id,
          data: {
            badge: hero.badge,
            headline_line1: hero.headline_line1,
            headline_line2: hero.headline_line2,
            headline_highlight: hero.headline_highlight,
            description: hero.description,
            primary_cta_text: hero.primary_cta_text,
            primary_cta_url: hero.primary_cta_url || '/products',
            secondary_cta_text: hero.secondary_cta_text,
            secondary_cta_url: hero.secondary_cta_url || '#farms',
            background_image_url: hero.background_image_url,
            background_public_id: hero.background_public_id || null,
            is_published: hero.is_published ?? true,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to save hero section');
      }

      if (json.data && Array.isArray(json.data) && json.data[0]) {
        setHero(json.data[0]);
      } else if (json.data && !Array.isArray(json.data)) {
        setHero(json.data);
      }

      setHeroSuccess(true);
      setTimeout(() => setHeroSuccess(false), 4000);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error saving hero section';
      setErrorMessage(msg);
    } finally {
      setSavingHero(false);
    }
  };

  const handleSaveBenefits = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBenefits(true);
    setBenefitsSuccess(false);
    setErrorMessage(null);

    try {
      // Save each benefit card
      const updatedBenefits = [...benefits];

      for (let i = 0; i < updatedBenefits.length; i++) {
        const item = updatedBenefits[i];
        const isExistingInDb = item.id && !item.id.startsWith('local-') && item.id.length > 10;

        const payloadData = {
          title: item.title,
          subtitle: item.subtitle || '',
          icon_name: item.icon_name || 'leaf',
          sort_order: i + 1,
        };

        if (isExistingInDb) {
          const res = await fetch('/api/admin/content', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              table: 'hero_benefits',
              id: item.id,
              data: payloadData,
            }),
          });
          const json = await res.json();
          if (!res.ok || json.error) {
            throw new Error(json.error || `Failed to update benefit #${i + 1}`);
          }
        } else {
          const res = await fetch('/api/admin/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              table: 'hero_benefits',
              data: payloadData,
            }),
          });
          const json = await res.json();
          if (!res.ok || json.error) {
            throw new Error(json.error || `Failed to create benefit #${i + 1}`);
          }
          if (json.data?.id) {
            updatedBenefits[i] = { ...item, id: json.data.id };
          }
        }
      }

      setBenefits(updatedBenefits);
      setBenefitsSuccess(true);
      setTimeout(() => setBenefitsSuccess(false), 4000);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error saving benefit highlights';
      setErrorMessage(msg);
    } finally {
      setSavingBenefits(false);
    }
  };

  const updateBenefit = (index: number, field: keyof HeroBenefit, value: string | number) => {
    setBenefits((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Hero Section & Benefits</h1>
            <p className="text-xs text-gray-500 mt-1">
              Configure the top banner, primary copy, and 4 floating highlight cards saved to Supabase
            </p>
          </div>
          {hero.id && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#15803d] border border-emerald-200 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected to Real DB (Row ID: {hero.id.slice(0, 8)}...)
            </span>
          )}
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center justify-between">
            <span>⚠️ {errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-red-500 hover:text-red-700 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {heroSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#15803d] text-sm font-semibold">
            ✓ Hero settings saved successfully to Supabase! Changes are live on the homepage.
          </div>
        )}

        {/* Hero Section Form */}
        <form onSubmit={handleSaveHero} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-lg font-bold text-gray-900">
              Primary Copy & Typography
            </h2>
            <div className="flex items-center gap-2">
              <label htmlFor="is_published" className="text-xs font-bold text-gray-600 cursor-pointer">
                Published Live
              </label>
              <input
                id="is_published"
                type="checkbox"
                checked={hero.is_published ?? true}
                onChange={(e) => setHero({ ...hero, is_published: e.target.checked })}
                className="w-4 h-4 accent-[#15803d] rounded cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Top Badge
            </label>
            <input
              type="text"
              value={hero.badge || ''}
              onChange={(e) => setHero({ ...hero, badge: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
              placeholder="e.g. FRESH VEGETABLES, BETTER LIVING."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Headline Line 1
              </label>
              <input
                type="text"
                value={hero.headline_line1 || ''}
                onChange={(e) => setHero({ ...hero, headline_line1: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                placeholder="e.g. Fresh from"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Headline Line 2
              </label>
              <input
                type="text"
                value={hero.headline_line2 || ''}
                onChange={(e) => setHero({ ...hero, headline_line2: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                placeholder="e.g. Local Farms"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Headline Highlight (Green)
              </label>
              <input
                type="text"
                value={hero.headline_highlight || ''}
                onChange={(e) => setHero({ ...hero, headline_highlight: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                placeholder="e.g. to Your Table"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Description Paragraph
            </label>
            <textarea
              rows={3}
              value={hero.description || ''}
              onChange={(e) => setHero({ ...hero, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
              placeholder="Provide a clear, inviting overview of firstQuality's mission and sourcing."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Primary Button Label
                </label>
                <input
                  type="text"
                  value={hero.primary_cta_text || ''}
                  onChange={(e) => setHero({ ...hero, primary_cta_text: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                  placeholder="e.g. Explore Our Products"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Primary Button URL
                </label>
                <input
                  type="text"
                  value={hero.primary_cta_url || ''}
                  onChange={(e) => setHero({ ...hero, primary_cta_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                  placeholder="e.g. /products"
                />
              </div>
            </div>

            <div className="space-y-3 p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Secondary CTA Button (Popup Video Trigger)
                  </label>
                  <p className="text-[11px] text-gray-500">
                    Controls the hero button that opens the popup video modal.
                  </p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  🎬 Popup Video
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Button Label
                </label>
                <input
                  type="text"
                  value={hero.secondary_cta_text || ''}
                  onChange={(e) => setHero({ ...hero, secondary_cta_text: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d] bg-white"
                  placeholder="e.g. Farm Videos"
                />
              </div>

              <div className="pt-1">
                <Link
                  href="/admin/hero-video"
                  className="inline-flex items-center justify-between w-full p-3 rounded-xl bg-white border border-emerald-300 hover:border-emerald-500 hover:shadow-xs text-xs font-bold text-emerald-900 transition group"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🎬</span>
                    <span>Configure Hero Popup Video & Media</span>
                  </span>
                  <span className="text-emerald-700 group-hover:translate-x-1 transition-transform">
                    Edit Video &rarr;
                  </span>
                </Link>
              </div>
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
              disabled={savingHero || loading}
              className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-[#15803d] hover:bg-[#166534] shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {savingHero && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {savingHero ? 'Saving to Database...' : 'Save Hero Section to DB'}
            </button>
          </div>
        </form>

        {/* 4 Benefits Management Form */}
        <form onSubmit={handleSaveBenefits} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                4 Floating Benefit Highlights
              </h2>
              <p className="text-xs text-gray-500">
                Edit and save the 4 quick feature badges displayed at the bottom of the hero banner
              </p>
            </div>
            <button
              type="submit"
              disabled={savingBenefits || loading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#15803d] hover:bg-[#166534] shadow-sm transition-all disabled:opacity-50 flex items-center gap-2 self-start sm:self-auto"
            >
              {savingBenefits && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {savingBenefits ? 'Saving Highlights...' : 'Save Highlights to DB'}
            </button>
          </div>

          {benefitsSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#15803d] text-sm font-semibold">
              ✓ All 4 Benefit highlights saved successfully to Supabase!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((b, index) => (
              <div key={b.id || index} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                    Card #{index + 1}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#15803d] shadow-2xs">
                    <IconRenderer iconName={b.icon_name} className="w-4 h-4 text-[#15803d]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Title Line 1
                  </label>
                  <input
                    type="text"
                    value={b.title || ''}
                    onChange={(e) => updateBenefit(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                    placeholder="e.g. Direct from"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Subtitle Line 2
                  </label>
                  <input
                    type="text"
                    value={b.subtitle || ''}
                    onChange={(e) => updateBenefit(index, 'subtitle', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                    placeholder="e.g. Local Farms"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Icon
                  </label>
                  <select
                    value={b.icon_name || 'leaf'}
                    onChange={(e) => updateBenefit(index, 'icon_name', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                  >
                    {AVAILABLE_ICONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.value})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
