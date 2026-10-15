'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FolderTree,
  Package,
  Plus,
  X,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { DeleteModal } from '@/components/admin/DeleteModal';
import type { ProductCategory, ProductItem } from '@/types';
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } from '@/services/defaults';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>(DEFAULT_CATEGORIES);
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<ProductCategory | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Save state
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Simple Form state (Category Name + Image - No field is strictly required)
  const [formData, setFormData] = useState<{
    name: string;
    image_url: string;
    image_public_id?: string;
    is_published: boolean;
  }>({
    name: '',
    image_url: '',
    image_public_id: '',
    is_published: true,
  });

  // Always-fresh ref for formData (prevents stale closure in handleSave)
  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        fetch('/api/admin/content?table=product_categories'),
        fetch('/api/admin/content?table=products'),
      ]);
      const catData = await catRes.json();
      const prodData = await prodRes.json();
      if (catData?.data && catData.data.length > 0) {
        setCategories(catData.data);
      }
      if (prodData?.data && prodData.data.length > 0) {
        setProducts(prodData.data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setActiveCategory(null);
    setSaveError(null);
    setFormData({
      name: '',
      image_url: '',
      image_public_id: '',
      is_published: true,
    });
    setEditModalOpen(true);
  };

  const handleOpenEdit = (cat: ProductCategory) => {
    setActiveCategory(cat);
    setSaveError(null);
    setFormData({
      name: cat.name || '',
      image_url: cat.image_url || '',
      image_public_id: cat.image_public_id || '',
      is_published: cat.is_published ?? true,
    });
    setEditModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    // Always read from ref to get the latest state (avoids stale closure issues)
    const latestForm = formDataRef.current;

    const categoryName = latestForm.name.trim() || 'New Category';
    const slugBase = categoryName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;

    // Use the uploaded image URL (guaranteed fresh via ref)
    const imageUrl = latestForm.image_url.trim() || '/images/cat-fresh-vegetables.jpg';

    const payload = {
      name: categoryName,
      slug: activeCategory?.slug || `${slugBase}-${Date.now().toString().slice(-5)}`,
      short_description: activeCategory?.short_description || `Fresh produce under ${categoryName}`,
      image_url: imageUrl,
      image_public_id: latestForm.image_public_id || null,
      is_published: latestForm.is_published ?? true,
      sort_order: activeCategory?.sort_order ?? categories.length + 1,
    };

    try {
      setSaving(true);
      if (activeCategory) {
        // Update existing category
        const res = await fetch('/api/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table: 'product_categories',
            id: activeCategory.id,
            data: payload,
          }),
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setCategories((prev) =>
          prev.map((c) =>
            c.id === activeCategory.id ? ({ ...c, ...payload } as ProductCategory) : c
          )
        );
      } else {
        // Create new category
        const uniqueSlug = `${slugBase}-${Date.now().toString().slice(-5)}`;
        const res = await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table: 'product_categories',
            data: { ...payload, slug: uniqueSlug },
          }),
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        const newCat = (json.data || { ...payload, slug: uniqueSlug, id: `cat-${Date.now()}` }) as ProductCategory;
        setCategories((prev) => [...prev, newCat]);
      }

      setEditModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save category';
      setSaveError(msg);
      console.error('Failed to save category:', err);
    } finally {
      setSaving(false);
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
            <div className="flex items-center gap-2.5 mb-1">
              <FolderTree className="w-6 h-6 text-[#15803d]" />
              <h1 className="text-2xl font-extrabold text-gray-900">Categories</h1>
            </div>
            <p className="text-xs text-gray-500">
              Add and manage product categories. Upload your image or name with ease.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-all"
            >
              <Package className="w-4 h-4 text-emerald-700" />
              <span>Manage Products</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#15803d] hover:bg-[#166534] shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Categories Grid (Clean & Compact) */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {categories.map((cat) => {
              const productCount = products.filter(
                (p) => p.category_id === cat.id || p.category_id === cat.slug
              ).length;

              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Category Thumbnail Image */}
                    <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                      <Image
                        src={cat.image_url || '/images/cat-fresh-vegetables.jpg'}
                        alt={cat.name || 'Category'}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                            cat.is_published
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-500 text-white'
                          }`}
                        >
                          {cat.is_published ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                    </div>

                    {/* Category Info */}
                    <div className="p-4">
                      <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                        {cat.name || 'Untitled Category'}
                      </h3>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span className="font-semibold text-[#15803d] bg-emerald-50 px-2 py-0.5 rounded-md">
                          {productCount} {productCount === 1 ? 'Product' : 'Products'}
                        </span>
                        <span className="font-mono text-[11px] text-gray-400">/{cat.slug}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-2">
                    <Link
                      href={`/admin/products?category=${cat.id}`}
                      className="text-xs font-bold text-[#15803d] hover:underline"
                    >
                      View Items →
                    </Link>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cat)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenDelete(cat)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#15803d] flex items-center justify-center mx-auto mb-3">
              <FolderTree className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No categories created yet</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              Create your first category (such as Fresh Vegetables, Organic Fruits, etc.) by clicking the button below.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#15803d] hover:bg-[#166534] shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Category</span>
            </button>
          </div>
        )}

        {/* Super Simple Add / Edit Category Modal */}
        {editModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
            onClick={() => setEditModalOpen(false)}
          >
            <div
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  {activeCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {/* 1. Category Name (Optional - has default if left empty) */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                    placeholder="e.g. Fresh Vegetables, Exotic Fruits, Spices"
                  />
                </div>

                {/* 2. Category Image Upload */}
                <ImageUploadField
                  label="Category Image"
                  value={formData.image_url}
                  onChange={(url, publicId) => {
                    setFormData((prev) => ({
                      ...prev,
                      image_url: url,
                      image_public_id: publicId,
                    }));
                  }}
                  folder="firstquality/categories"
                />

                {/* Publish Toggle */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 text-[#15803d] rounded"
                  />
                  <label htmlFor="is_published" className="text-xs font-bold text-gray-700">
                    Visible on website
                  </label>
                </div>

                {/* Save Error */}
                {saveError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{saveError}</span>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#15803d] hover:bg-[#166534] shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Category'}
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
