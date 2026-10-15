'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  PanelsTopLeft,
  Clapperboard,
  FolderTree,
  Package,
  Sprout,
  Settings2,
  Users,
  ChartNoAxesCombined,
  Sparkles,
  MessageSquareQuote,
  Mail,
  Images,
  Layers,
  ChevronDown,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItemConfig {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PRIMARY_NAV_ITEMS: NavItemConfig[] = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Hero & Benefits', href: '/admin/hero', icon: PanelsTopLeft },
  { label: 'Hero Popup Video', href: '/admin/hero-video', icon: Clapperboard },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Farm Section Videos', href: '/admin/farms', icon: Sprout },
  { label: 'Site Settings & DB', href: '/admin/settings', icon: Settings2 },
];

const CONTENT_MANAGEMENT_ITEMS: NavItemConfig[] = [
  { label: 'About & Features', href: '/admin/about', icon: Users },
  { label: 'Statistics', href: '/admin/statistics', icon: ChartNoAxesCombined },
  { label: 'Why Choose Us', href: '/admin/why-choose', icon: Sparkles },
  { label: 'Customer Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
  { label: 'Customer Enquiries', href: '/admin/enquiries', icon: Mail },
  { label: 'Cloudinary Media', href: '/admin/media', icon: Images },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isSecondaryActive = (href: string) =>
    pathname === href || (pathname ? pathname.startsWith(href + '/') : false);

  const hasActiveSecondaryChild = CONTENT_MANAGEMENT_ITEMS.some((item) =>
    isSecondaryActive(item.href)
  );

  const [contentOpen, setContentOpen] = useState(hasActiveSecondaryChild);

  // Auto-expand group when navigating directly to a nested Content Management page
  useEffect(() => {
    if (hasActiveSecondaryChild) {
      setContentOpen(true);
    } else {
      setContentOpen(false);
    }
  }, [pathname, hasActiveSecondaryChild]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const isPrimaryActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname === href || (pathname ? pathname.startsWith(href + '/') : false);
  };

  const renderNavContent = (onItemClick?: () => void) => (
    <div className="space-y-1">
      {/* Primary Navigation - Always Visible */}
      <div className="space-y-1">
        {PRIMARY_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = isPrimaryActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#15803d] text-white shadow-sm font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-emerald-400'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Divider */}
      <div className="pt-2 pb-1">
        <div className="h-px bg-emerald-900/80 my-2 mx-1" />

        {/* Secondary Navigation - Expandable Content Management */}
        <button
          type="button"
          onClick={() => setContentOpen((prev) => !prev)}
          aria-expanded={contentOpen}
          aria-controls="admin-content-management-menu"
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors select-none ${
            hasActiveSecondaryChild
              ? 'text-white bg-emerald-900/50 font-semibold'
              : 'text-gray-300 hover:text-white hover:bg-emerald-900/60'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Layers
              className={`w-4 h-4 flex-shrink-0 ${
                hasActiveSecondaryChild ? 'text-emerald-300' : 'text-emerald-400'
              }`}
            />
            <span className="truncate">Content Management</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 flex-shrink-0 text-emerald-400 transition-transform duration-200 ${
              contentOpen ? 'rotate-180 text-white' : ''
            }`}
          />
        </button>

        {/* Expandable Group Items */}
        {contentOpen && (
          <div
            id="admin-content-management-menu"
            className="mt-1 space-y-1 pl-3 transition-all duration-200"
          >
            <div className="border-l border-emerald-800/80 pl-2 space-y-1">
              {CONTENT_MANAGEMENT_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = isSecondaryActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onItemClick}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#15803d] text-white shadow-sm font-semibold'
                        : 'text-gray-300 hover:text-white hover:bg-emerald-900/60'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        isActive ? 'text-white' : 'text-emerald-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

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
        <nav className="flex-1 px-3 py-4 overflow-y-auto min-h-0 admin-sidebar-scroll">
          {renderNavContent()}
        </nav>

        {/* Footer info pinned at bottom of sidebar */}
        <div className="p-4 border-t border-emerald-900/80 space-y-2 flex-shrink-0 bg-[#0b2f1f]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950 hover:bg-emerald-900 border border-emerald-900/60 transition-colors shadow-sm"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
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
              <Menu className="w-5 h-5" />
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
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-rose-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
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
                  className="text-gray-400 hover:text-white p-1"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-4 py-2.5 bg-emerald-950/60 text-xs font-semibold uppercase tracking-wider text-emerald-400 flex-shrink-0">
                Admin CMS
              </div>
              <nav className="flex-1 px-3 py-4 overflow-y-auto min-h-0 admin-sidebar-scroll">
                {renderNavContent(() => setSidebarOpen(false))}
              </nav>
              <div className="p-4 border-t border-emerald-900/80 space-y-2 flex-shrink-0 bg-[#0b2f1f]">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950 hover:bg-emerald-900 transition-colors"
                >
                  <span>View Live Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
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

