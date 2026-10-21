'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DeleteModal } from '@/components/admin/DeleteModal';
import type { BusinessEnquiry } from '@/types';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<BusinessEnquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingEnquiry, setDeletingEnquiry] = useState<BusinessEnquiry | null>(null);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/content?table=enquiries');
      const json = await res.json();
      if (json?.data) {
        setEnquiries(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'enquiries',
          id,
          data: { status: newStatus },
        }),
      });

      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus as BusinessEnquiry['status'] } : e))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingEnquiry) return;
    try {
      await fetch('/api/admin/content', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'enquiries',
          id: deletingEnquiry.id,
        }),
      });
      setEnquiries((prev) => prev.filter((e) => e.id !== deletingEnquiry.id));
      setDeleteModalOpen(false);
      setDeletingEnquiry(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = enquiries.filter((e) => {
    if (filterType === 'all') return true;
    return e.enquiry_type === filterType;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Customer & Wholesale Enquiries</h1>
            <p className="text-xs text-gray-500 mt-1">
              Review and manage incoming enquiries submitted through the website
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold bg-white text-gray-700 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="wholesale">Wholesale</option>
              <option value="export">Export</option>
              <option value="restaurant">Restaurant</option>
              <option value="retail">Retail</option>
              <option value="farmer">Farmer</option>
              <option value="other">General</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          {filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="text-xs text-gray-400 uppercase bg-gray-50/70 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-bold">Contact</th>
                    <th className="px-6 py-4 font-bold">Business</th>
                    <th className="px-6 py-4 font-bold">Type</th>
                    <th className="px-6 py-4 font-bold">Message</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((enq) => (
                    <tr key={enq.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{enq.full_name}</div>
                        <div className="text-xs text-gray-500">{enq.phone}</div>
                        <div className="text-xs text-gray-400">{enq.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        {enq.business_name ? (
                          <span className="font-medium text-gray-900">{enq.business_name}</span>
                        ) : (
                          <span className="text-xs text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 capitalize font-semibold text-xs text-[#15803d]">
                        {enq.enquiry_type}
                      </td>
                      <td className="px-6 py-4 max-w-sm">
                        <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {enq.message}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={enq.status}
                          onChange={(e) => handleUpdateStatus(enq.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-[#15803d] border border-emerald-200"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="resolved">Resolved</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingEnquiry(enq);
                            setDeleteModalOpen(true);
                          }}
                          className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center text-gray-400 text-sm">
              No enquiries match the selected filter.
            </div>
          )}
        </div>

        <DeleteModal
          isOpen={deleteModalOpen}
          itemDescription={deletingEnquiry ? `enquiry from ${deletingEnquiry.full_name}` : ''}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />
      </div>
    </AdminLayout>
  );
}
