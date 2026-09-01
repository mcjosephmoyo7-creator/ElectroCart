'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { adminAuthStore } from '@/store/adminAuthStore';
import { categoryApi } from '@/lib/api';
import type { DashboardCategory } from '@/types/dashboard';
import {
  HiOutlineChartBar,
  HiOutlineBell,
  HiOutlineLightningBolt,
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineSpeakerphone,
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiOutlineCog,
  HiOutlineCollection,
  HiOutlineTag,
  HiOutlineFolder,
  HiOutlineCurrencyDollar,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineSearch,
  HiOutlineLogout,
  HiOutlineChevronLeft,
  HiOutlinePlus,
} from 'react-icons/hi';

const navSections = [
  {
    label: 'Performance',
    items: [
      { label: 'Analytics', href: '/dashboard', icon: HiOutlineChartBar },
      { label: 'Notifications', href: '/dashboard/notifications', icon: HiOutlineBell },
      { label: 'Performance', href: '/dashboard', icon: HiOutlineLightningBolt },
      { label: 'Orders', href: '/dashboard/orders', icon: HiOutlineShoppingBag },
    ],
  },
  {
    label: 'Products',
    items: [
      { label: 'All Products', href: '/dashboard/products', icon: HiOutlineDocumentText },
      { label: 'Shipping', href: '/dashboard/shipping', icon: HiOutlineTruck },
      { label: 'Campaigns', href: '/dashboard/campaigns', icon: HiOutlineSpeakerphone },
      { label: 'Catalog', href: '/dashboard/categories', icon: HiOutlineCollection },
    ],
  },
  {
    label: 'My Store',
    items: [
      { label: 'Categories', href: '/dashboard/categories', icon: HiOutlineFolder },
      { label: 'Finance', href: '/dashboard/finance', icon: HiOutlineCurrencyDollar },
      { label: 'Customers', href: '/dashboard/customers', icon: HiOutlineUsers },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', href: '/dashboard/settings', icon: HiOutlineCog },
    ],
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = adminAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<DashboardCategory[]>([]);

  useEffect(() => {
    categoryApi
      .getAll()
      .then((res) => setCategories((res.data.data || []).slice(0, 5)))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push('/dashboard/login');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
          {!collapsed && (
            <span className="text-xl font-bold text-white tracking-tight">
              Electro<span className="text-accent">Cart</span>
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1.5 text-white/50 hover:text-white transition-colors hidden lg:flex"
        >
          <HiOutlineChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-4 py-3">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-white/10 text-white text-sm rounded-lg pl-9 pr-3 py-2 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-accent/50"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <div className="flex items-center gap-2 px-2 mb-2">
                <span className="w-1.5 h-4 bg-accent rounded-full" />
                <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider">
                  {section.label}
                </span>
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      active
                        ? 'bg-accent text-white shadow-lg shadow-accent/20'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}

              {/* Dynamic categories under My Store section */}
              {section.label === 'My Store' && categories.length > 0 && !collapsed && (
                <div className="pl-10 pt-1 space-y-0.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/dashboard/products?category=${cat.slug}`}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <HiOutlineTag className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{cat.name}</span>
                    </Link>
                  ))}
                  <Link
                    href="/dashboard/categories"
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-accent hover:text-accent-light transition-colors"
                  >
                    <HiOutlinePlus className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Manage Categories</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-accent">
              {user?.username?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.username || 'Admin'}
              </p>
              <p className="text-xs text-white/40 truncate">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="p-2 text-white/40 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <HiOutlineLogout className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-navy rounded-lg text-white shadow-lg"
      >
        <HiOutlineMenu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-navy z-50 transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 text-white/60 hover:text-white"
        >
          <HiOutlineX className="w-5 h-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:block bg-navy transition-all duration-300 flex-shrink-0 ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
