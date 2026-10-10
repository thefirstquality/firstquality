'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import type { SourcingPhilosophyData, SourcingPillar } from '@/types';
import { DEFAULT_SOURCING, DEFAULT_SOURCING_PILLARS } from '@/services/defaults';

export default function AdminSourcingPage() {
  const [sourcing, setSourcing] = useState<SourcingPhilosophyData>(DEFAULT_SOURCING);
  const [pillars, setPillars] = useState<SourcingPillar[]>(DEFAULT_SOURCING_PILLARS);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSourcing = async () => {
      try {
        const [sRes, pRes] = await Promise.all([
          fetch('/api/admin/content?table=sourcing_philosophy'),
          fetch('/api/admin/content?table=sourcing_pillars'),
        ]);
        const sJson = await sRes.json();
        const pJson = await pRes.json();
        if (sJson?.data?.[0]) setSourcing(sJson.data[0]);
        if (pJson?.data && pJson.data.length > 0) setPillars(pJson.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchSourcing();
  }, []);

  const handlePillarChange = (index: number, field: keyof SourcingPillar, value: string) => {
    setPillars((prev) => {
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
      await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'sourcing_philosophy',
          id: sourcing.id,
          data: sourcing,
        }),
      });

      for (const p of pillars) {
        await fetch('/api/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table: 'sourcing_pillars',
            id: p.id,
            data: p,
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
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Sourcing Philosophy</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage deep forest-green section copy and 3 feature cards from Reference 2
          </p>
        </div>

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#15803d] text-sm font-semibold">
            ✓ Sourcing philosophy saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900">Banner Text</h2>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Heading
              </label>
              <input
                type="text"
                value={sourcing.heading}
                onChange={(e) => setSourcing({ ...sourcing, heading: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={sourcing.description}
                onChange={(e) => setSourcing({ ...sourcing, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={sourcing.cta_text}
                onChange={(e) => setSourcing({ ...sourcing, cta_text: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]"
              />
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900">3 Sourcing Pillars</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {pillars.map((p, index) => (
                <div key={p.id || index} className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-3">
                  <span className="text-xs font-bold text-[#15803d] uppercase">{p.icon_name}</span>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={p.title}
                      onChange={(e) => handlePillarChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#15803d]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={p.description}
                      onChange={(e) => handlePillarChange(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#15803d]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-[#15803d] hover:bg-[#166534] shadow-md transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Sourcing Philosophy'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
