'use client';

import React, { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Package,
  FolderTree,
  Plus,
  Search,
  X,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { DeleteModal } from '@/components/admin/DeleteModal';
import type { ProductCategory, ProductItem } from '@/types';
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } from '@/services/defaults';

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const initialCatFilter = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState<ProductCategory[]>(DEFAULT_CATEGORIES);
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCatFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');

  // Add / Edit Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<ProductItem>>({
    category_id: '',
    name: '',
    slug: '',
    description: '',
    image_url: '',
    unit: '',
    price_text: '',
    in_stock: true,
    sort_order: 0,
    is_published: true,
  });

  // Always-fresh ref so handleSave always reads the latest formData
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
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update filter if query parameter changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category Filter
      if (selectedCategory !== 'all') {
        const matchesCat =
          item.category_id === selectedCategory ||
          categories.find((c) => c.slug === selectedCategory && c.id === item.category_id) ||
          categories.find((c) => c.id === selectedCategory && c.slug === item.category_id);
        if (!matchesCat) return false;
      }

      // Stock filter
      if (stockFilter === 'in_stock' && !item.in_stock) return false;
      if (stockFilter === 'out_of_stock' && item.in_stock) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesUnit = item.unit?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesUnit) return false;
      }

      return true;
    });
  }, [products, selectedCategory, stockFilter, searchQuery, categories]);

  const handleOpenAdd = () => {
    setActiveProduct(null);
    setSaveError(null);
    const defaultCatId =
      selectedCategory !== 'all' ? selectedCategory : (categories[0]?.id || '');

    setFormData({
      category_id: defaultCatId,
      name: '',
      slug: '',
      description: '',
      image_url: '',
      unit: '',
      price_text: '',
      in_stock: true,
      sort_order: products.length + 1,
      is_published: true,
    });
    setEditModalOpen(true);
  };

  const handleOpenEdit = (product: ProductItem) => {
    setActiveProduct(product);
    setSaveError(null);
    setFormData({ ...product });
    setEditModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    // Always read from ref for freshest state (avoids stale closure after async upload)
    const latestForm = formDataRef.current;

    if (!latestForm.name?.trim()) {
      setSaveError('Product name is required.');
      return;
    }
    if (!latestForm.category_id) {
      setSaveError('Please select a category.');
      return;
    }

    // Build payload with auto-generated fallbacks
    const productName = latestForm.name.trim();
    const slugBase = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const payload: Partial<ProductItem> = {
      ...latestForm,
      name: productName,
      slug: latestForm.slug?.trim() || `${slugBase}-${Date.now().toString().slice(-5)}`,
      description: latestForm.description?.trim() || `Fresh ${productName} from Kerala farms.`,
      image_url: latestForm.image_url?.trim() || '/images/cat-fresh-vegetables.jpg',
      unit: latestForm.unit?.trim() || '',
      in_stock: latestForm.in_stock ?? true,
      is_published: latestForm.is_published ?? true,
      sort_order: latestForm.sort_order ?? products.length + 1,
    };

    try {
      setSaving(true);
      if (activeProduct) {
        // Update existing product
        const res = await fetch('/api/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table: 'products',
            id: activeProduct.id,
            data: payload,
          }),
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error);

        setProducts((prev) =>
          prev.map((p) => (p.id === activeProduct.id ? ({ ...p, ...payload } as ProductItem) : p))
        );
      } else {
        // Create new product — add timestamp to slug to guarantee uniqueness
        const uniqueSlug = `${slugBase}-${Date.now().toString().slice(-5)}`;
        const res = await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table: 'products',
            data: { ...payload, slug: uniqueSlug },
          }),
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        const newProduct = (json.data || { ...payload, slug: uniqueSlug, id: `prod-${Date.now()}` }) as ProductItem;
        setProducts((prev) => [...prev, newProduct]);
      }

      setEditModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save product';
      setSaveError(msg);
      console.error('Failed to save product:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (product: ProductItem) => {
    setDeletingProduct(product);
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      setDeleteLoading(true);
      await fetch('/api/admin/content', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'products',
          id: deletingProduct.id,
        }),
      });

      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      setDeleteModalOpen(false);
      setDeletingProduct(null);
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleStockStatus = async (product: ProductItem) => {
    const updatedStatus = !product.in_stock;
    try {
      await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'products',
          id: product.id,
          data: { in_stock: updatedStatus },
        }),
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, in_stock: updatedStatus } : p))
      );
    } catch (err) {
      console.error('Failed to toggle stock status:', err);
    }
  };

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId || c.slug === catId);
    return cat ? cat.name : 'Unknown Category';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <Package className="w-6 h-6 text-[#15803d]" />
              <h1 className="text-2xl font-extrabold text-gray-900">Products Catalog</h1>
            </div>
            <p className="text-xs text-gray-500">
              Create, update, and manage fresh produce, pack sizes, stock availability, and categories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-all"
            >
              <FolderTree className="w-4 h-4 text-emerald-700" />
              <span>Manage Categories</span>
            </Link>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#15803d] hover:bg-[#166534] shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase">Total Items</div>
            <div className="text-2xl font-black text-gray-900 mt-1">{products.length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-emerald-600 uppercase">In Stock</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              {products.filter((p) => p.in_stock).length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-rose-600 uppercase">Out of Stock</div>
            <div className="text-2xl font-black text-rose-700 mt-1">
              {products.filter((p) => !p.in_stock).length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 uppercase">Categories</div>
            <div className="text-2xl font-black text-gray-900 mt-1">{categories.length}</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products by name, description, or unit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 p-0.5 text-gray-400 hover:text-gray-600 rounded"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Stock Filter */}
            <div className="flex items-center gap-2">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]"
              >
                <option value="all">All Stock Status</option>
                <option value="in_stock">In Stock Only</option>
                <option value="out_of_stock">Out of Stock Only</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-gray-100 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#15803d] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Categories ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter(
                (p) => p.category_id === cat.id || p.category_id === cat.slug
              ).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id || selectedCategory === cat.slug
                      ? 'bg-[#15803d] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-[4/3] w-full bg-gray-100">
                    <Image
                      src={product.image_url || '/images/cat-fresh-vegetables.jpg'}
                      alt={product.name || 'Product'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm">
                        {getCategoryName(product.category_id)}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                          product.in_stock
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      {!product.is_published && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-gray-900 leading-tight">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {product.unit && (
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold text-[11px]">
                          Unit: {product.unit}
                        </span>
                      )}
                      {product.price_text && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#15803d] font-bold text-[11px]">
                          {product.price_text}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="text-[11px] font-mono text-gray-400">
                      slug: /{product.slug}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-between gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => toggleStockStatus(product)}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors inline-flex items-center gap-1 ${
                      product.in_stock
                        ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        : 'border-rose-200 text-rose-700 hover:bg-rose-50'
                    }`}
                    title="Click to toggle In Stock / Out of Stock"
                  >
                    {product.in_stock ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Available</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3 text-rose-600" />
                        <span>Out of Stock</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(product)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(product)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#15803d] flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No products found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No products match your search "${searchQuery}".`
                : 'There are no products in this category yet.'}
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#15803d] hover:bg-[#166534] shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Product</span>
            </button>
          </div>
        )}

        {/* Add / Edit Product Modal */}
        {editModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
            onClick={() => setEditModalOpen(false)}
          >
            <div
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  {activeProduct ? 'Edit Product Item' : 'Add New Produce Item'}
                </h2>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Category Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  {categories.length === 0 ? (
                    <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        You haven&apos;t added any categories yet.
                      </span>
                      <Link
                        href="/admin/categories"
                        className="font-bold underline text-amber-900 hover:text-amber-700"
                      >
                        + Create Category First
                      </Link>
                    </div>
                  ) : (
                    <select
                      required
                      value={formData.category_id || ''}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                    >
                      <option value="" disabled>
                        Select a parent category
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} ({cat.slug})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Name & Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Product Name <span className="text-red-500">*</span>
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
                          slug: !activeProduct
                            ? name
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/(^-|-$)/g, '')
                            : formData.slug,
                        });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                      placeholder="e.g. Country Tomatoes (നാടൻ തക്കാളി)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      URL Slug <span className="text-gray-400 font-normal">(auto-generated if empty)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                      placeholder="country-tomatoes (auto-filled from name)"
                    />
                  </div>
                </div>

                {/* Unit & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Pack / Unit Size (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.unit || ''}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                      placeholder="e.g. 1 kg, 500 g (Leave empty if none)"
                    />
                    <div className="flex gap-1.5 mt-1.5 flex-wrap items-center">
                      {['1 kg', '500 g', '250 g', '1 Pack', '1 Kit', '1 Box', '1 Litre'].map(
                        (preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setFormData({ ...formData, unit: preset })}
                            className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                              formData.unit === preset
                                ? 'bg-[#15803d] text-white font-bold'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            }`}
                          >
                            {preset}
                          </button>
                        )
                      )}
                      {formData.unit && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, unit: '' })}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold"
                        >
                          <X className="w-3 h-3" />
                          <span>Clear</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Price / Display Rate (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.price_text || ''}
                      onChange={(e) => setFormData({ ...formData, price_text: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                      placeholder="e.g. ₹38 / kg or Market Rate"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Product Description <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                    placeholder="Freshly harvested produce details, farm origin, or preparation notes..."
                  />
                </div>

                {/* Image Upload */}
                <ImageUploadField
                  label="Product Photo"
                  value={formData.image_url}
                  onChange={(url, publicId) => {
                    setFormData((prev) => ({
                      ...prev,
                      image_url: url,
                      image_public_id: publicId,
                    }));
                  }}
                  folder="firstquality/products"
                />

                {/* Stock, Published & Sort order */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100 items-center">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="in_stock"
                      checked={formData.in_stock ?? true}
                      onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                      className="w-4 h-4 text-[#15803d] rounded"
                    />
                    <label htmlFor="in_stock" className="text-xs font-bold text-gray-700">
                      In Stock & Available
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_published"
                      checked={formData.is_published ?? true}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="w-4 h-4 text-[#15803d] rounded"
                    />
                    <label htmlFor="is_published" className="text-xs font-bold text-gray-700">
                      Published on Site
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sort_order ?? 0}
                      onChange={(e) =>
                        setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                    />
                  </div>
                </div>

                {/* Save Error */}
                {saveError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{saveError}</span>
                  </div>
                )}

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#15803d] hover:bg-[#166534] shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteModal
          isOpen={deleteModalOpen}
          itemDescription={deletingProduct?.name || 'this product'}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
          isLoading={deleteLoading}
          errorMessage={deleteError}
        />
      </div>
    </AdminLayout>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout>
          <div className="p-8 text-center text-gray-500 font-medium">
            Loading products catalog...
          </div>
        </AdminLayout>
      }
    >
      <AdminProductsContent />
    </Suspense>
  );
}
