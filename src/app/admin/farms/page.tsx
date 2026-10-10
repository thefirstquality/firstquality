'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { DeleteModal } from '@/components/admin/DeleteModal';
import type { FarmVideoItem } from '@/types';
import { DEFAULT_FARM_VIDEOS } from '@/services/defaults';

export default function AdminFarmsPage() {
  const [videos, setVideos] = useState<FarmVideoItem[]>(DEFAULT_FARM_VIDEOS);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<FarmVideoItem | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingVideo, setDeletingVideo] = useState<FarmVideoItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<FarmVideoItem>>({
    title: '',
    duration: '0:45',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: '',
    is_featured: false,
    sort_order: 0,
    is_published: true,
  });

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/admin/content?table=farm_videos');
      const data = await res.json();
      if (data?.data && data.data.length > 0) {
        setVideos(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleOpenAdd = () => {
    setActiveVideo(null);
    setFormData({
      title: '',
      duration: '0:45',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail_url: '',
      is_featured: false,
      sort_order: videos.length + 1,
      is_published: true,
    });
    setEditModalOpen(true);
  };

  const handleOpenEdit = (v: FarmVideoItem) => {
    setActiveVideo(v);
    setFormData({ ...v });
    setEditModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.thumbnail_url) {
      alert('Please fill in required fields (Title, Thumbnail)');
      return;
    }

    try {
      if (activeVideo) {
        await fetch('/api/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table: 'farm_videos',
            id: activeVideo.id,
            data: formData,
          }),
        });
        setVideos((prev) =>
          prev.map((v) => (v.id === activeVideo.id ? ({ ...v, ...formData } as FarmVideoItem) : v))
        );
      } else {
        const res = await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table: 'farm_videos',
            data: formData,
          }),
        });
        const json = await res.json();
        const newV = (json.data || { ...formData, id: `v-${Date.now()}` }) as FarmVideoItem;
        setVideos((prev) => [...prev, newV]);
      }

      setEditModalOpen(false);
    } catch (err) {
      console.error('Failed to save farm video:', err);
    }
  };

  const handleOpenDelete = (v: FarmVideoItem) => {
    setDeletingVideo(v);
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingVideo) return;
    try {
      setDeleteLoading(true);
      await fetch('/api/admin/content', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'farm_videos',
          id: deletingVideo.id,
        }),
      });

      setVideos((prev) => prev.filter((v) => v.id !== deletingVideo.id));
      setDeleteModalOpen(false);
      setDeletingVideo(null);
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
            <h1 className="text-2xl font-extrabold text-gray-900">Farm Videos & Footage</h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage video cards shown in Reference 2 (&quot;Real Farms. Real People. Real Work.&quot;)
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#15803d] hover:bg-[#166534] shadow-sm transition-all"
          >
            <span>+ Add Video</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full bg-gray-900">
                  <Image
                    src={v.thumbnail_url}
                    alt={v.title}
                    fill
                    className="object-cover"
                    unoptimized={v.thumbnail_url.startsWith('/images/')}
                  />
                  <div className="absolute top-2 left-2">
                    {v.is_featured && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                        ★ Featured
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[11px] font-mono">
                    {v.duration}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-1">{v.title}</h3>
                  <a
                    href={v.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-700 hover:underline line-clamp-1"
                  >
                    {v.video_url}
                  </a>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(v)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenDelete(v)}
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
                {activeVideo ? 'Edit Farm Video' : 'Add Farm Video'}
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                    placeholder="Harvesting Fresh Vegetables"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Duration (e.g. 0:45)
                    </label>
                    <input
                      type="text"
                      value={formData.duration || '0:45'}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Video / YouTube URL
                    </label>
                    <input
                      type="url"
                      value={formData.video_url || ''}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="Video Thumbnail Image"
                  value={formData.thumbnail_url}
                  onChange={(url, publicId) => {
                    setFormData({
                      ...formData,
                      thumbnail_url: url,
                      thumbnail_public_id: publicId,
                    });
                  }}
                  folder="firstquality/farms"
                />

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured || false}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-[#15803d] rounded"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                    Set as Large Featured Video Card (Main display)
                  </label>
                </div>

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
                    Save Video
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <DeleteModal
          isOpen={deleteModalOpen}
          itemDescription={deletingVideo?.title || 'this video'}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
          isLoading={deleteLoading}
          errorMessage={deleteError}
        />
      </div>
    </AdminLayout>
  );
}
