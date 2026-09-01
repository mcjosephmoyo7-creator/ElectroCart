'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { customerApi, orderApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/dashboardUtils';
import type { DashboardUser, DashboardOrder } from '@/types/dashboard';
import { HiOutlineArrowLeft, HiOutlineMail, HiOutlineUser, HiOutlinePhone } from 'react-icons/hi';
import toast from 'react-hot-toast';
import StatusBadge from '@/components/dashboard/StatusBadge';

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<DashboardUser | null>(null);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [custRes, ordersRes] = await Promise.allSettled([
          customerApi.getById(params.id),
          orderApi.getAll({ limit: '100' }),
        ]);
        if (custRes.status === 'fulfilled') setCustomer(custRes.value.data.data);
        if (ordersRes.status === 'fulfilled') {
          const allOrders = ordersRes.value.data.data.orders || [];
          setOrders(allOrders.filter((o: DashboardOrder) => {
            if (typeof o.user === 'object' && o.user) return o.user._id === params.id;
            return false;
          }));
        }
      } catch {
        toast.error('Failed to load customer');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-16">
        <p className="text-muted text-sm">Customer not found.</p>
        <Link href="/dashboard/customers" className="text-primary text-sm mt-2 inline-block">
          Back to Customers
        </Link>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const orderCount = orders.length;
  const avgOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/customers"
        className="flex items-center gap-2 text-sm font-medium text-muted hover:text-primary transition-colors inline-flex"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        Back to Customers
      </Link>

      <div className="bg-white border border-lineBorder rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            {customer.avatar ? (
              <img
                src={customer.avatar}
                alt={customer.username}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              <HiOutlineUser className="w-8 h-8 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slateText font-heading">
                {customer.username || 'User'}
              </h2>
              <StatusBadge status={customer.role} />
              <StatusBadge status={customer.isActive ? 'active' : 'inactive'} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <HiOutlineMail className="w-4 h-4" />
                {customer.email}
              </span>
              {customer.phone && (
                <span className="flex items-center gap-1.5">
                  <HiOutlinePhone className="w-4 h-4" />
                  {customer.phone}
                </span>
              )}
            </div>
            <p className="text-xs text-muted mt-1.5">
              Joined {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-lineBorder rounded-xl p-5">
          <p className="text-xs text-muted font-medium mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-slateText">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="bg-white border border-lineBorder rounded-xl p-5">
          <p className="text-xs text-muted font-medium mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-slateText">{orderCount}</p>
        </div>
        <div className="bg-white border border-lineBorder rounded-xl p-5">
          <p className="text-xs text-muted font-medium mb-1">Avg Order Value</p>
          <p className="text-2xl font-bold text-slateText">{formatCurrency(avgOrderValue)}</p>
        </div>
      </div>

      {/* Order history */}
      <div className="bg-white border border-lineBorder rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-lineBorder">
          <h3 className="text-base font-bold text-slateText">Order History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-body">
                {['Order', 'Date', 'Items', 'Total', 'Status', 'Payment'].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-lineBorder">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-muted text-sm">
                    No orders yet
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-body/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/orders/${order._id}`}
                        className="text-sm font-semibold text-primary"
                      >
                        #{order._id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slateText">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.paymentStatus} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
