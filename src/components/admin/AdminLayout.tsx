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
    { label: 'About & Features', href: '/admin/about', icon: '👨‍🌾' },
    { label: 'Statistics', href: '/admin/statistics', icon: '📈' },
    { label: 'Why Choose Us', href: '/admin/why-choose', icon: '✨' },
    { label: 'Products & Categories', href: '/admin/products', icon: '🥦' },
    { label: 'Sourcing Philosophy', href: '/admin/sourcing', icon: '🌱' },
    { label: 'Farm Videos', href: '/admin/farms', icon: '🎬' },
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
    <div className="min-h-screen bg-[#f8faf8] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0b2f1f] text-white flex-shrink-0 border-r border-emerald-950">
        {/* Brand */}
        <div className="p-6 border-b border-emerald-900/80 flex items-center justify-between">
          <Logo variant="light" />
        </div>

        <div className="px-4 py-3 bg-emerald-950/60 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          Admin CMS
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#15803d] text-white shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-emerald-900/60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-emerald-900/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950 hover:bg-emerald-900 transition-colors"
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
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <h1 className="text-lg font-bold text-gray-900">
              firstQuality Management System
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-[#15803d] font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>CMS Online</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-gray-600 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-rose-200"
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="w-64 bg-[#0b2f1f] text-white h-full flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-emerald-900">
                <Logo variant="light" />
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                      pathname === item.href
                        ? 'bg-[#15803d] text-white'
                        : 'text-gray-300 hover:bg-emerald-900/60'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
