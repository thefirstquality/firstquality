'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { DeleteModal } from '@/components/admin/DeleteModal';
import type { TestimonialItem } from '@/types';
import { DEFAULT_TESTIMONIALS } from '@/services/defaults';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<TestimonialItem | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<TestimonialItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<TestimonialItem>>({
    customer_name: '',
    role: '',
    location: '',
    quote: '',
    avatar_url: '',
    sort_order: 0,
    is_published: true,
  });

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/content?table=testimonials');
      const data = await res.json();
      if (data?.data && data.data.length > 0) {
        setTestimonials(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenAdd = () => {
    setActiveItem(null);
    setFormData({
      customer_name: '',
      role: 'Restaurant Owner',
      location: 'Thrissur, Kerala',
      quote: '',
      avatar_url: '',
      sort_order: testimonials.length + 1,
      is_published: true,
    });
    setEditModalOpen(true);
  };

  const handleOpenEdit = (t: TestimonialItem) => {
    setActiveItem(t);
    setFormData({ ...t });
    setEditModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.quote) {
      alert('Please fill in required fields (Customer Name, Quote)');
      return;
    }

    try {
      if (activeItem) {
        await fetch('/api/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table: 'testimonials',
            id: activeItem.id,
            data: formData,
          }),
        });
        setTestimonials((prev) =>
          prev.map((t) => (t.id === activeItem.id ? ({ ...t, ...formData } as TestimonialItem) : t))
        );
      } else {
        const res = await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table: 'testimonials',
            data: formData,
          }),
        });
        const json = await res.json();
        const newT = (json.data || { ...formData, id: `t-${Date.now()}` }) as TestimonialItem;
        setTestimonials((prev) => [...prev, newT]);
      }

      setEditModalOpen(false);
    } catch (err) {
      console.error('Failed to save testimonial:', err);
    }
  };

  const handleOpenDelete = (t: TestimonialItem) => {
    setDeletingItem(t);
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    try {
      setDeleteLoading(true);
      await fetch('/api/admin/content', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'testimonials',
          id: deletingItem.id,
        }),
      });

      setTestimonials((prev) => prev.filter((t) => t.id !== deletingItem.id));
      setDeleteModalOpen(false);
      setDeletingItem(null);
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Deletion failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Customer Testimonials</h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage testimonial cards and customer photos shown in Reference 2 carousel
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#15803d] hover:bg-[#166534] shadow-sm transition-all"
          >
            <span>+ Add Testimonial</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <p className="text-sm text-gray-700 italic mb-6 leading-relaxed">
                  &quot;{t.quote}&quot;
                </p>

                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={t.avatar_url || '/images/testimonial-avatar.jpg'}
                      alt={t.customer_name}
                      fill
                      className="object-cover"
                      unoptimized={t.avatar_url.startsWith('/images/')}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{t.customer_name}</h3>
                    <p className="text-xs text-gray-500">
                      {t.role} • {t.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(t)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenDelete(t)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {editModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
            onClick={() => setEditModalOpen(false)}
          >
            <div
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {activeItem ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Customer Name / Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name || ''}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                    placeholder="Restaurant Owner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Role / Business
                    </label>
                    <input
                      type="text"
                      value={formData.role || ''}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                      placeholder="Restaurant Owner"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Location in Kerala
                    </label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                      placeholder="Thrissur, Kerala"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Testimonial Quote <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.quote || ''}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                    placeholder="We have been sourcing vegetables from firstQuality..."
                  />
                </div>

                <ImageUploadField
                  label="Customer Avatar Photo"
                  value={formData.avatar_url}
                  onChange={(url, publicId) => {
                    setFormData({
                      ...formData,
                      avatar_url: url,
                      avatar_public_id: publicId,
                    });
                  }}
                  folder="firstquality/testimonials"
                />

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#15803d] hover:bg-[#166534] shadow-md"
                  >
                    Save Testimonial
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <DeleteModal
          isOpen={deleteModalOpen}
          itemDescription={deletingItem?.customer_name || 'this testimonial'}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
          isLoading={deleteLoading}
          errorMessage={deleteError}
        />
      </div>
    </AdminLayout>
  );
}
