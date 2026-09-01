'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { orderApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/dashboardUtils';
import type { DashboardOrder } from '@/types/dashboard';
import {
  HiOutlineSearch,
  HiOutlineEye,
  HiOutlineShoppingBag,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import Pagination from '@/components/dashboard/Pagination';
import StatusBadge from '@/components/dashboard/StatusBadge';

type OrderStatusFilter = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const statusTabs: { key: OrderStatusFilter; label: string; color: string }[] = [
  { key: 'all', label: 'All Orders', color: 'bg-primary' },
  { key: 'pending', label: 'Pending', color: 'bg-amber-500' },
  { key: 'processing', label: 'Processing', color: 'bg-blue-500' },
  { key: 'shipped', label: 'Shipped', color: 'bg-purple-500' },
  { key: 'delivered', label: 'Delivered', color: 'bg-emerald-500' },
  { key: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatusFilter>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit: 10 };
    if (filter !== 'all') params.status = filter;
    try {
      const res = await orderApi.getAll(params);
      const data = res.data.data;
      setOrders(data.orders || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const handleStatusChange = async (order: DashboardOrder, status: string) => {
    setUpdating(order._id);
    try {
      await orderApi.updateStatus(order._id, status);
      toast.success('Order status updated');
      fetchOrders();
    } catch {
      toast.error('Failed to update order status');
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = search
    ? orders.filter((o) => {
        const customer =
          typeof o.user === 'object' && o.user
            ? (o.user.username || '').toLowerCase()
            : '';
        const id = o._id.toLowerCase();
        const q = search.toLowerCase();
        return customer.includes(q) || id.includes(q);
      })
    : orders;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slateText font-heading">
            Orders
          </h2>
          <p className="text-sm text-muted mt-0.5">{total} total orders</p>
        </div>
        <div className="relative sm:w-72">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer or ID..."
            className="w-full bg-white rounded-lg pl-9 pr-4 py-2.5 text-sm text-slateText placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary border border-lineBorder"
          />
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              filter === tab.key
                ? 'bg-primary text-white'
                : 'bg-white text-slateText border border-lineBorder hover:bg-body'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${tab.color}`} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-lineBorder rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-body">
                {['Order', 'Customer', 'Items', 'Total', 'Status', 'Payment', 'Date', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-lineBorder">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <p className="text-sm text-muted">Loading orders...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <HiOutlineShoppingBag className="w-10 h-10 text-muted/30 mx-auto mb-3" />
                    <p className="text-sm text-muted">No orders found</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const customer =
                    typeof order.user === 'object' && order.user
                      ? order.user
                      : null;
                  return (
                    <tr key={order._id} className="hover:bg-body/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-primary">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-slateText">
                          {customer?.username || 'Guest'}
                        </span>
                        {customer?.email && (
                          <p className="text-xs text-muted">{customer.email}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">
                        {order.items?.length || 0} items
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slateText">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order, e.target.value)}
                          disabled={updating === order._id}
                          className="text-xs font-semibold rounded-lg px-2 py-1 border border-lineBorder bg-white focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.paymentStatus} />
                      </td>
                      <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/orders/${order._id}`}
                          className="p-2 text-muted hover:text-primary transition-colors inline-flex"
                          title="View order"
                        >
                          <HiOutlineEye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-lineBorder">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
