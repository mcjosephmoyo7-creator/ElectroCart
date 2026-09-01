'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { HiOutlineLogout, HiOutlineCube, HiOutlineMail } from 'react-icons/hi';
import { authStore } from '@/store/authStore';
import { orderApi } from '@/lib/api';
import AuthGate from '@/components/auth/AuthGate';
import { formatPrice } from '@/lib/utils';

interface BackendOrder {
  _id: string;
  orderId?: string;
  items?: { name: string; image?: string; price?: number; quantity?: number }[];
  total?: number;
  subtotal?: number;
  orderStatus?: string;
  paymentStatus?: string;
  createdAt?: string;
}

export default function AccountPage() {
  return (
    <AuthGate
      title="Sign in to view your account"
      subtitle="Manage your profile, orders and security from one secure place."
      benefits={['orders', 'secure']}
    >
      <AccountContent />
    </AuthGate>
  );
}

function AccountContent() {
  const router = useRouter();
  const user = authStore((s) => s.user);
  const logout = authStore((s) => s.logout);

  const [orders, setOrders] = useState<BackendOrder[] | null>(null);

  useEffect(() => {
    orderApi
      .getMyOrders()
      .then((res) => {
        const data = res.data?.data;
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => setOrders([]));
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully');
    router.push('/');
  };

  const initial = (user?.username || 'U').charAt(0).toUpperCase();

  return (
    <div className="container-custom py-8 lg:py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-1">Home / Account</p>
      <h1 className="text-3xl lg:text-4xl font-bold text-slateText dark:text-white mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
        {/* Profile */}
        <aside className="space-y-4 h-fit lg:sticky lg:top-28">
          <div className="bg-white dark:bg-navy-200 border border-lineBorder dark:border-navy-50 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-5">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary dark:text-white flex items-center justify-center text-xl font-bold">
                  {initial}
                </div>
              )}
              <div className="min-w-0">
                <h2 className="font-bold text-slateText dark:text-white truncate">{user?.username}</h2>
                <p className="text-sm text-muted flex items-center gap-1.5 truncate">
                  <HiOutlineMail className="w-3.5 h-3.5 shrink-0" /> {user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-lineBorder dark:border-navy-50 text-sm">
              <span className="text-muted">Account type</span>
              <span className="font-semibold capitalize text-slateText dark:text-white">{user?.role || 'customer'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-lineBorder dark:border-navy-50 text-sm">
              <span className="text-muted">Member</span>
              <span className="font-semibold text-slateText dark:text-white">ElectroCart</span>
            </div>

            <button onClick={handleLogout} className="mt-4 w-full flex items-center justify-center gap-2 btn-outline py-2.5 text-sm">
              <HiOutlineLogout className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Orders */}
        <div className="bg-white dark:bg-navy-200 border border-lineBorder dark:border-navy-50 rounded-2xl p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slateText dark:text-white flex items-center gap-2.5">
              <HiOutlineCube className="w-6 h-6 text-primary" /> My Orders
            </h2>
          </div>

          {orders === null ? (
            <div className="py-16 flex justify-center">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="mb-3"><HiOutlineCube className="w-16 h-16 inline-block text-muted/40" /></p>
              <h3 className="font-bold text-slateText dark:text-white mb-1">No orders yet</h3>
              <p className="text-sm text-muted mb-6">When you place an order it will show up here.</p>
              <button onClick={() => router.push('/shop')} className="btn-primary inline-flex">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border border-lineBorder dark:border-navy-50 rounded-xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div>
                      <p className="font-bold text-slateText dark:text-white text-sm">
                        {order.orderId || order._id}
                      </p>
                      <p className="text-xs text-muted">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.orderStatus && (
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-primary/10 text-primary capitalize">
                          {order.orderStatus}
                        </span>
                      )}
                      {order.paymentStatus && (
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-success/10 text-success capitalize">
                          {order.paymentStatus}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="h-px bg-lineBorder dark:bg-navy-50 mb-3" />

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {(order.items || []).slice(0, 4).map((item, i) =>
                        item.image ? (
                          <div key={i} className="w-9 h-9 rounded-lg overflow-hidden border-2 border-white dark:border-navy-200">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ) : null
                      )}
                      {(order.items || []).length > 4 && (
                        <div className="w-9 h-9 rounded-lg bg-body dark:bg-navy-100 border-2 border-white dark:border-navy-200 flex items-center justify-center text-[10px] font-bold text-muted">
                          +{order.items!.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted">{(order.items || []).length} item{(order.items || []).length === 1 ? '' : 's'}</p>
                      <p className="font-bold text-primary">{formatPrice(order.total ?? 0)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}