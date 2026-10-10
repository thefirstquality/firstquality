'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { DeleteModal } from '@/components/admin/DeleteModal';
import type { ProductCategory } from '@/types';
import { DEFAULT_CATEGORIES } from '@/services/defaults';

export default function AdminProductsPage() {
  const [categories, setCategories] = useState<ProductCategory[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<ProductCategory | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<ProductCategory>>({
    name: '',
    slug: '',
    short_description: '',
    full_description: '',
    image_url: '',
    sort_order: 0,
    is_published: true,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/content?table=product_categories');
      const data = await res.json();
      if (data?.data && data.data.length > 0) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setActiveCategory(null);
    setFormData({
      name: '',
      slug: '',
      short_description: '',
      full_description: '',
      image_url: '',
      sort_order: categories.length + 1,
      is_published: true,
    });
    setEditModalOpen(true);
  };

  const handleOpenEdit = (cat: ProductCategory) => {
    setActiveCategory(cat);
    setFormData({ ...cat });
    setEditModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug || !formData.image_url) {
      alert('Please fill in required fields (Name, Slug, Image)');
      return;
    }

    try {
      if (activeCategory) {
        // Update existing
        await fetch('/api/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table: 'product_categories',
            id: activeCategory.id,
            data: formData,
          }),
        });
        setCategories((prev) =>
          prev.map((c) => (c.id === activeCategory.id ? ({ ...c, ...formData } as ProductCategory) : c))
        );
      } else {
        // Create new
        const res = await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table: 'product_categories',
            data: formData,
          }),
        });
        const json = await res.json();
        const newCat = (json.data || { ...formData, id: `cat-${Date.now()}` }) as ProductCategory;
        setCategories((prev) => [...prev, newCat]);
      }

      setEditModalOpen(false);
    } catch (err) {
      console.error('Failed to save category:', err);
    }
  };

  const handleOpenDelete = (cat: ProductCategory) => {
    setDeletingCategory(cat);
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    try {
      setDeleteLoading(true);
      await fetch('/api/admin/content', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'product_categories',
          id: deletingCategory.id,
        }),
      });

      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      setDeleteModalOpen(false);
      setDeletingCategory(null);
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Product Categories</h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage image-led categories shown in Reference 2 (Fresh Vegetables, Fresh-Cut, Combo Kits, Kitchen Essentials)
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#15803d] hover:bg-[#166534] shadow-sm transition-all"
          >
            <span>+ Add Category</span>
          </button>
        </div>

        {/* Categories Grid / Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] w-full bg-gray-100">
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    unoptimized={cat.image_url.startsWith('/images/')}
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cat.is_published
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {cat.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-1">{cat.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                    {cat.short_description}
                  </p>
                  <span className="text-[11px] font-mono text-gray-400">/{cat.slug}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(cat)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenDelete(cat)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add / Edit Popup Modal */}
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
                {activeCategory ? 'Edit Product Category' : 'Create Product Category'}
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({
                        ...formData,
                        name,
                        slug: !activeCategory
                          ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                          : formData.slug,
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                    placeholder="e.g. Fresh Vegetables"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Slug URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                    placeholder="fresh-vegetables"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Short Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.short_description || ''}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                    placeholder="A wide range of farm fresh vegetables sourced from Kerala farmers."
                  />
                </div>

                {/* Cloudinary Image Upload Control */}
                <ImageUploadField
                  label="Category Photo"
                  value={formData.image_url}
                  onChange={(url, publicId) => {
                    setFormData({
                      ...formData,
                      image_url: url,
                      image_public_id: publicId,
                    });
                  }}
                  folder="firstquality/categories"
                />

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published ?? true}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 text-[#15803d] rounded"
                  />
                  <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                    Publish immediately on public website
                  </label>
                </div>

                {/* Form Buttons */}
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
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteModal
          isOpen={deleteModalOpen}
          itemDescription={deletingCategory?.name || 'this category'}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
          isLoading={deleteLoading}
          errorMessage={deleteError}
        />
      </div>
    </AdminLayout>
  );
}
