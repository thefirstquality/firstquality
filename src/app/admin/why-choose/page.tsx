'use client';

import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import type { WhyChooseItem } from '@/types';
import { DEFAULT_WHY_CHOOSE } from '@/services/defaults';

export default function AdminWhyChoosePage() {
  const [items, setItems] = useState<WhyChooseItem[]>(DEFAULT_WHY_CHOOSE);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/admin/content?table=why_choose_items');
        const json = await res.json();
        if (json?.data && json.data.length > 0) setItems(json.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchItems();
  }, []);

  const handleChange = (index: number, field: keyof WhyChooseItem, value: string) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      for (const item of items) {
        await fetch('/api/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table: 'why_choose_items',
            id: item.id,
            data: item,
          }),
        });
      }
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Why Choose firstQuality Cards</h1>
          <p className="text-xs text-gray-500 mt-1">
            Update the 4 horizontal cards shown in Reference 1 (Fresh Produce, Quality First, Support Local Farmers, Reliable Supply)
          </p>
        </div>

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#15803d] text-sm font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Why Choose items saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((item, index) => (
              <div key={item.id || index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Card #{index + 1} ({item.icon_name})
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={item.title}
                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={item.description}
                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-[#15803d] hover:bg-[#166534] shadow-md transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Why Choose Cards'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
