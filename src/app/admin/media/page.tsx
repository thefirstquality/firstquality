'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { DeleteModal } from '@/components/admin/DeleteModal';

interface MediaItem {
  id: string;
  url: string;
  publicId: string;
  name: string;
  size?: number;
  uploadedAt: string;
}

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaItem[]>([
    {
      id: '1',
      url: '/images/hero-farm-produce.jpg',
      publicId: 'firstquality/hero-farm-produce',
      name: 'hero-farm-produce.jpg',
      uploadedAt: 'Today',
    },
    {
      id: '2',
      url: '/images/farmer-field.jpg',
      publicId: 'firstquality/farmer-field',
      name: 'farmer-field.jpg',
      uploadedAt: 'Today',
    },
    {
      id: '3',
      url: '/images/cta-carrots.jpg',
      publicId: 'firstquality/cta-carrots',
      name: 'cta-carrots.jpg',
      uploadedAt: 'Today',
    },
    {
      id: '4',
      url: '/images/cat-fresh-vegetables.jpg',
      publicId: 'firstquality/cat-fresh-vegetables',
      name: 'cat-fresh-vegetables.jpg',
      uploadedAt: 'Today',
    },
    {
      id: '5',
      url: '/images/cat-fresh-cut.jpg',
      publicId: 'firstquality/cat-fresh-cut',
      name: 'cat-fresh-cut.jpg',
      uploadedAt: 'Today',
    },
    {
      id: '6',
      url: '/images/cat-combo-kit.jpg',
      publicId: 'firstquality/cat-combo-kit',
      name: 'cat-combo-kit.jpg',
      uploadedAt: 'Today',
    },
    {
      id: '7',
      url: '/images/cat-kitchen-essentials.jpg',
      publicId: 'firstquality/cat-kitchen-essentials',
      name: 'cat-kitchen-essentials.jpg',
      uploadedAt: 'Today',
    },
    {
      id: '8',
      url: '/images/farm-harvesting.jpg',
      publicId: 'firstquality/farm-harvesting',
      name: 'farm-harvesting.jpg',
      uploadedAt: 'Today',
    },
    {
      id: '9',
      url: '/images/testimonial-chef.jpg',
      publicId: 'firstquality/testimonial-chef',
      name: 'testimonial-chef.jpg',
      uploadedAt: 'Today',
    },
  ]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingAsset, setDeletingAsset] = useState<MediaItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleUploadSuccess = (url: string, publicId?: string) => {
    if (!url) return;
    const newItem: MediaItem = {
      id: `media-${Date.now()}`,
      url,
      publicId: publicId || url,
      name: url.split('/').pop() || 'uploaded-asset',
      uploadedAt: 'Just now',
    };
    setAssets((prev) => [newItem, ...prev]);
  };

  const handleOpenDelete = (item: MediaItem) => {
    setDeletingAsset(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAsset) return;
    try {
      setDeleteLoading(true);
      await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: deletingAsset.publicId }),
      });
      setAssets((prev) => prev.filter((a) => a.id !== deletingAsset.id));
      setDeleteModalOpen(false);
      setDeletingAsset(null);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Cloudinary Media Library</h1>
          <p className="text-xs text-gray-500 mt-1">
            Upload, optimize, and manage high-resolution website graphics and photography
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Upload New Media Asset
          </h2>
          <ImageUploadField
            label="Select image from computer (Max 4 MB. Images &gt; 2 MB trigger compression prompt)"
            onChange={handleUploadSuccess}
            folder="firstquality/assets"
          />
        </div>

        {/* Assets Grid */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-6">
            Managed Assets ({assets.length})
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="group relative rounded-2xl border border-gray-200/80 overflow-hidden bg-gray-50 flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full bg-gray-200">
                  <Image
                    src={asset.url}
                    alt={asset.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    unoptimized={asset.url.startsWith('/images/')}
                  />
                </div>

                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-800 truncate" title={asset.name}>
                    {asset.name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{asset.uploadedAt}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenDelete(asset)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  title="Delete asset"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <DeleteModal
          isOpen={deleteModalOpen}
          itemDescription={deletingAsset?.name || 'this media file'}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
          isLoading={deleteLoading}
        />
      </div>
    </AdminLayout>
  );
}
