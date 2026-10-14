'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Overview', href: '/admin', icon: '📊' },
    { label: 'Hero & Benefits', href: '/admin/hero', icon: '🌄' },
    { label: 'Hero Popup Video', href: '/admin/hero-video', icon: '🎬' },
    { label: 'About & Features', href: '/admin/about', icon: '👨‍🌾' },
    { label: 'Statistics', href: '/admin/statistics', icon: '📈' },
    { label: 'Why Choose Us', href: '/admin/why-choose', icon: '✨' },
    { label: 'Categories', href: '/admin/categories', icon: '📁' },
    { label: 'Products', href: '/admin/products', icon: '🥦' },
    { label: 'Farm Section Videos', href: '/admin/farms', icon: '🚜' },
    { label: 'Customer Testimonials', href: '/admin/testimonials', icon: '💬' },
    { label: 'Customer Enquiries', href: '/admin/enquiries', icon: '📬' },
    { label: 'Cloudinary Media', href: '/admin/media', icon: '🖼️' },
    { label: 'Site Settings & DB', href: '/admin/settings', icon: '⚙️' },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-screen w-full bg-[#f8faf8] flex overflow-hidden">
      {/* Sidebar Desktop - Fixed Position with Scrollable Nav */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 h-screen bg-[#0b2f1f] text-white flex-shrink-0 border-r border-emerald-950 z-30 select-none">
        {/* Brand Header */}
        <div className="p-6 border-b border-emerald-900/80 flex items-center justify-between flex-shrink-0">
          <Logo variant="light" />
        </div>

        <div className="px-4 py-2.5 bg-emerald-950/60 text-xs font-semibold uppercase tracking-wider text-emerald-400 flex-shrink-0">
          Admin CMS
        </div>

        {/* Scrollable Nav inside fixed sidebar */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto min-h-0 admin-sidebar-scroll">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#15803d] text-white shadow-sm font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-emerald-900/60'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info pinned at bottom of sidebar */}
        <div className="p-4 border-t border-emerald-900/80 space-y-2 flex-shrink-0 bg-[#0b2f1f]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950 hover:bg-emerald-900 border border-emerald-900/60 transition-colors shadow-sm"
          >
            <span>View Live Site</span>
            <span>↗</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area - Independently Scrollable */}
      <div className="flex-1 lg:pl-64 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200/80 px-4 sm:px-8 flex items-center justify-between flex-shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <h1 className="text-lg font-bold text-gray-900 truncate">
              firstQuality Management System
            </h1>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-[#15803d] font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>CMS Online</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-gray-600 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-rose-200 transition-colors"
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="w-64 max-w-[80vw] bg-[#0b2f1f] text-white h-full flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-emerald-900 flex items-center justify-between flex-shrink-0">
                <Logo variant="light" />
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-white p-1 text-lg font-bold"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>
              <div className="px-4 py-2.5 bg-emerald-950/60 text-xs font-semibold uppercase tracking-wider text-emerald-400 flex-shrink-0">
                Admin CMS
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto min-h-0 admin-sidebar-scroll">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                      pathname === item.href
                        ? 'bg-[#15803d] text-white font-semibold'
                        : 'text-gray-300 hover:bg-emerald-900/60'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-emerald-900/80 space-y-2 flex-shrink-0 bg-[#0b2f1f]">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950 hover:bg-emerald-900 transition-colors"
                >
                  <span>View Live Site</span>
                  <span>↗</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/40 transition-colors"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content - Independently Scrollable */}
        <main className="flex-1 overflow-y-auto admin-main-scroll p-4 sm:p-8 overscroll-contain">
          <div className="max-w-7xl w-full mx-auto pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
