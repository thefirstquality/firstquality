import React from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  getProductCategories,
  getFarmVideos,
  getTestimonials,
} from '@/services/contentService';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';


export default async function AdminDashboardPage() {
  const [categories, videos, testimonials] = await Promise.all([
    getProductCategories(),
    getFarmVideos(),
    getTestimonials(),
  ]);

  let enquiriesCount = 0;
  let recentEnquiries: Array<{
    id: string;
    full_name: string;
    phone: string;
    email: string;
    enquiry_type: string;
    message: string;
    status: string;
    created_at: string;
  }> = [];

  const adminSupabase = createAdminSupabaseClient();
  if (adminSupabase) {
    const { data, count } = await adminSupabase
      .from('enquiries')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) recentEnquiries = data;
    if (count) enquiriesCount = count;
  }

  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const isCloudinaryConfigured = Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0b2f1f] to-[#15803d] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
              MANAGEMENT DASHBOARD
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 mb-2">
              Welcome to firstQuality CMS
            </h1>
            <p className="text-sm text-emerald-100 max-w-xl">
              Manage website sections, edit product catalogs, update farm documentary footage, and monitor incoming business supply enquiries.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-5 py-2.5 rounded-xl bg-white text-[#0b2f1f] text-xs font-bold hover:bg-emerald-50 transition-colors shadow-sm"
            >
              Preview Live Site ↗
            </Link>
          </div>
        </div>

        {/* System Health Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase">Supabase DB</div>
              <div className="text-base font-bold text-gray-900 mt-1">
                {isSupabaseConfigured ? 'Connected' : 'Baseline Active'}
              </div>
            </div>
            <span
              className={`w-3 h-3 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase">Cloudinary CDN</div>
              <div className="text-base font-bold text-gray-900 mt-1">
                {isCloudinaryConfigured ? 'Configured' : 'Local Fallback'}
              </div>
            </div>
            <span
              className={`w-3 h-3 rounded-full ${
                isCloudinaryConfigured ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase">Categories</div>
              <div className="text-xl font-bold text-gray-900 mt-1">
                {categories.length}
              </div>
            </div>
            <span className="text-xl">🥦</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase">Total Enquiries</div>
              <div className="text-xl font-bold text-gray-900 mt-1">
                {enquiriesCount}
              </div>
            </div>
            <span className="text-xl">📬</span>
          </div>
        </div>

        {/* Quick Management Cards */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Content Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/admin/hero"
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group"
            >
              <div className="text-2xl mb-2">🌄</div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15803d]">
                Hero & Benefit Highlights
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Update headlines, background crate photo, and 4 benefit icons.
              </p>
            </Link>

            <Link
              href="/admin/about"
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group"
            >
              <div className="text-2xl mb-2">👨‍🌾</div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15803d]">
                About Section & Features
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Update farmer photo, company story, and 4 core principle cards.
              </p>
            </Link>

            <Link
              href="/admin/products"
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group"
            >
              <div className="text-2xl mb-2">🥦</div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15803d]">
                Product Categories & Items
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Manage fresh vegetables, cut vegetables, combo kits, and essentials.
              </p>
            </Link>

            <Link
              href="/admin/farms"
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group"
            >
              <div className="text-2xl mb-2">🎬</div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15803d]">
                Farm Videos
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Manage harvest video thumbnails, play URLs, and duration tags ({videos.length} videos).
              </p>
            </Link>

            <Link
              href="/admin/testimonials"
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group"
            >
              <div className="text-2xl mb-2">💬</div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15803d]">
                Customer Testimonials
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Manage quotes, restaurant owner avatars, and customer roles ({testimonials.length} reviews).
              </p>
            </Link>

            <Link
              href="/admin/media"
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group"
            >
              <div className="text-2xl mb-2">🖼️</div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15803d]">
                Media & Cloudinary Asset Manager
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Upload image assets with 4MB validation and 2MB compression assistant.
              </p>
            </Link>
          </div>
        </div>

        {/* Recent Enquiries Table */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Enquiries</h2>
              <p className="text-xs text-gray-500">
                Latest customer and business wholesale requests
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-[#15803d] hover:underline"
            >
              View All Enquiries →
            </Link>
          </div>

          {recentEnquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Phone</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Message</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentEnquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {enq.full_name}
                      </td>
                      <td className="px-4 py-3">{enq.phone}</td>
                      <td className="px-4 py-3 capitalize font-semibold text-xs text-[#15803d]">
                        {enq.enquiry_type}
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate">{enq.message}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#15803d]">
                          {enq.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-400 text-sm">
              No new customer enquiries yet. Submissions from the public enquiry form will appear here.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
