import React from 'react';
import Link from 'next/link';
import {
  FolderTree,
  Package,
  PanelsTopLeft,
  Clapperboard,
  Users,
  ChartNoAxesCombined,
  Sparkles,
  Sprout,
  MessageSquareQuote,
  Images,
  Settings2,
  Mail,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  getProductCategories,
  getProducts,
  getFarmVideos,
  getTestimonials,
} from '@/services/contentService';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export const instant = false;

export default async function AdminDashboardPage() {
  const [categories, products, videos, testimonials] = await Promise.all([
    getProductCategories(),
    getProducts(),
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
              Manage website sections, create and organize product categories & items, update farm documentary footage, and monitor incoming business supply enquiries.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-[#0b2f1f] text-xs font-bold hover:bg-emerald-50 transition-colors shadow-sm"
            >
              <span>Preview Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* System Health Indicators & Counts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase">Supabase DB</div>
              <div className="text-sm font-bold text-gray-900 mt-1">
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
              <div className="text-sm font-bold text-gray-900 mt-1">
                {isCloudinaryConfigured ? 'Configured' : 'Local Fallback'}
              </div>
            </div>
            <span
              className={`w-3 h-3 rounded-full ${
                isCloudinaryConfigured ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
          </div>

          <Link
            href="/admin/categories"
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase group-hover:text-[#15803d]">Categories</div>
              <div className="text-xl font-bold text-gray-900 mt-1">
                {categories.length}
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center group-hover:bg-[#15803d] group-hover:text-white transition-colors">
              <FolderTree className="w-5 h-5" />
            </div>
          </Link>

          <Link
            href="/admin/products"
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase group-hover:text-[#15803d]">Products</div>
              <div className="text-xl font-bold text-gray-900 mt-1">
                {products.length}
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center group-hover:bg-[#15803d] group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
          </Link>

          <Link
            href="/admin/enquiries"
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase group-hover:text-[#15803d]">Enquiries</div>
              <div className="text-xl font-bold text-gray-900 mt-1">
                {enquiriesCount}
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center group-hover:bg-[#15803d] group-hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </div>
          </Link>
        </div>

        {/* Quick Management Cards */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Content Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/admin/categories"
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center mb-3 group-hover:bg-[#15803d] group-hover:text-white transition-colors">
                  <FolderTree className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15803d]">
                  Product Categories ({categories.length})
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Manage high-level produce categories (Fresh Vegetables, Fresh-Cut, Combo Kits, Kitchen Essentials).
                </p>
              </div>
            </Link>

            <Link
              href="/admin/products"
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center mb-3 group-hover:bg-[#15803d] group-hover:text-white transition-colors">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15803d]">
                  Produce & Products Catalog ({products.length})
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Create & update vegetable items, pricing, units, descriptions, and stock availability.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/hero"
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center mb-3 group-hover:bg-[#15803d] group-hover:text-white transition-colors">
                  <PanelsTopLeft className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15803d]">
                  Hero & Benefit Highlights
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Update headlines, background crate photo, and 4 benefit icons.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/hero-video"
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center mb-3 group-hover:bg-[#15803d] group-hover:text-white transition-colors">
                  <Clapperboard className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15803d]">
                  Hero Popup Video
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Configure the dedicated hero button video modal, title, preview, and YouTube or uploaded file source.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/about"
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center mb-3 group-hover:bg-[#15803d] group-hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15803d]">
                  About Section & Features
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Update farmer photo, company story, and 4 core principle cards.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/statistics"
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center mb-3 group-hover:bg-[#15803d] group-hover:text-white transition-colors">
                  <ChartNoAxesCombined className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15803d]">
                  Key Statistics
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Update customer counts, farmer network numbers, and service regions.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/why-choose"
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center mb-3 group-hover:bg-[#15803d] group-hover:text-white transition-colors">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15803d]">
                  Why Choose Us Pillars
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Manage 4 value proposition cards displayed across landing pages.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/farms"
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center mb-3 group-hover:bg-[#15803d] group-hover:text-white transition-colors">
                  <Sprout className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15803d]">
                  Farm Videos ({videos.length})
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Manage harvest video thumbnails, play URLs, and duration tags.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/testimonials"
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center mb-3 group-hover:bg-[#15803d] group-hover:text-white transition-colors">
                  <MessageSquareQuote className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15803d]">
                  Customer Testimonials ({testimonials.length})
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Manage quotes, restaurant owner avatars, and customer roles.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/media"
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center mb-3 group-hover:bg-[#15803d] group-hover:text-white transition-colors">
                  <Images className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15803d]">
                  Media & Cloudinary Asset Manager
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Upload image assets with 4MB validation and 2MB compression assistant.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/settings"
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center mb-3 group-hover:bg-[#15803d] group-hover:text-white transition-colors">
                  <Settings2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15803d]">
                  Site Settings & DB Connection
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Configure brand name, phone, WhatsApp number, and addresses.
                </p>
              </div>
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
              className="inline-flex items-center gap-1 text-xs font-bold text-[#15803d] hover:underline"
            >
              <span>View All Enquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
