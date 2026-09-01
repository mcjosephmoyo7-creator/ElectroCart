'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { adminAuthStore } from '@/store/adminAuthStore';
import { productApi, orderApi } from '@/lib/api';
import { HiOutlineBell, HiOutlineSearch } from 'react-icons/hi';

export default function DashboardHeader() {
  const pathname = usePathname();
  const { user } = adminAuthStore();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.allSettled([
          productApi.getAll({ limit: '100' }),
          orderApi.getAll({ limit: '20' }),
        ]);
        if (!active) return;
        let count = 0;
        if (productsRes.status === 'fulfilled') {
          const products = productsRes.value.data.data.products || [];
          count += products.filter((p: { stock: number }) => p.stock < 10).length;
        }
        if (ordersRes.status === 'fulfilled') {
          const orders = ordersRes.value.data.data.orders || [];
          count += orders.filter((o: { orderStatus: string }) =>
            ['pending', 'processing'].includes(o.orderStatus)
          ).length;
        }
        setNotificationCount(count);
      } catch {
        // ignore
      }
    };
    load();
    const interval = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    const segments = pathname.split('/').filter(Boolean);
    const last = segments[segments.length - 1];
    if (last === 'new') return 'Add New';
    if (last === 'products' && pathname.includes('/products/')) return 'Edit Product';
    if (last === 'orders' && pathname.includes('/orders/')) return 'Order Detail';
    if (last === 'customers' && pathname.includes('/customers/')) return 'Customer Detail';
    return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ');
  };

  return (
    <header className="bg-white border-b border-lineBorder px-6 py-4 flex items-center gap-4">
      <div className="lg:hidden w-10" />
      <div className="flex-1">
        <h1 className="text-xl lg:text-2xl font-bold text-slateText font-heading">
          {getPageTitle()}
        </h1>
      </div>

      <div className="hidden md:flex items-center gap-3">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-body rounded-lg pl-9 pr-4 py-2 text-sm text-slateText placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary border border-lineBorder w-64"
          />
        </div>
      </div>

      <Link
        href="/dashboard/notifications"
        className="relative p-2.5 text-muted hover:text-primary transition-colors"
      >
        <HiOutlineBell className="w-5 h-5" />
        {notificationCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {notificationCount > 99 ? '99+' : notificationCount}
          </span>
        )}
      </Link>

      <div className="flex items-center gap-3 pl-3 border-l border-lineBorder">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">
            {user?.username?.charAt(0)?.toUpperCase() || 'A'}
          </span>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-slateText leading-tight">
            {user?.username || 'Admin'}
          </p>
          <p className="text-[11px] text-muted leading-tight">
            {user?.role === 'seller' ? 'Store Owner' : 'Administrator'}
          </p>
        </div>
      </div>
    </header>
  );
}
