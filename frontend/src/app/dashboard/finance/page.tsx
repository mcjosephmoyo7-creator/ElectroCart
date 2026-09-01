'use client';

import { useEffect, useState, useCallback } from 'react';
import { orderApi, dashboardApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/dashboardUtils';
import type { DashboardOrder } from '@/types/dashboard';
import { HiOutlineCurrencyDollar, HiOutlineTrendingUp, HiOutlineShoppingBag, HiOutlineUsers, HiOutlineDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';
import StatusBadge from '@/components/dashboard/StatusBadge';

export default function FinancePage() {
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [stats, setStats] = useState<{ totalSales: number; totalOrders: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.allSettled([
        orderApi.getAll({ limit: '100' }),
        dashboardApi.getStats(),
      ]);
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data.data.orders || []);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.data);
    } catch {
      toast.error('Failed to load finance data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
  const totalRevenue = stats?.totalSales ?? paidOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders = stats?.totalOrders ?? orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalRefunds = orders
    .filter((o) => o.paymentStatus === 'refunded')
    .reduce((s, o) => s + o.total, 0);

  const handleExport = () => {
    const header = 'Order,Date,Total,Payment,Status';
    const rows = orders.map((o) =>
      [
        `#${o._id.slice(-8).toUpperCase()}`,
        new Date(o.createdAt).toISOString(),
        o.total,
        o.paymentStatus,
        o.orderStatus,
      ].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'electrocart-transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slateText font-heading">Finance</h2>
          <p className="text-sm text-muted mt-0.5">Revenue, payouts and transactions</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slateText bg-white border border-lineBorder rounded-lg hover:bg-body transition-colors"
        >
          <HiOutlineDownload className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-lineBorder rounded-xl p-5">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
                <HiOutlineCurrencyDollar className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-xs text-muted font-medium mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-slateText">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="bg-white border border-lineBorder rounded-xl p-5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                <HiOutlineShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs text-muted font-medium mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-slateText">{totalOrders}</p>
            </div>
            <div className="bg-white border border-lineBorder rounded-xl p-5">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-3">
                <HiOutlineTrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xs text-muted font-medium mb-1">Avg Order Value</p>
              <p className="text-2xl font-bold text-slateText">{formatCurrency(avgOrderValue)}</p>
            </div>
            <div className="bg-white border border-lineBorder rounded-xl p-5">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-3">
                <HiOutlineCurrencyDollar className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-xs text-muted font-medium mb-1">Total Refunds</p>
              <p className="text-2xl font-bold text-slateText">{formatCurrency(totalRefunds)}</p>
            </div>
          </div>

          <div className="bg-white border border-lineBorder rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-lineBorder">
              <h3 className="text-base font-bold text-slateText">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-body">
                    {['Order', 'Date', 'Customer', 'Total', 'Payment', 'Status'].map((h) => (
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
                        No transactions yet
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const customer =
                        typeof order.user === 'object' && order.user ? order.user : null;
                      return (
                        <tr key={order._id} className="hover:bg-body/50 transition-colors">
                          <td className="px-4 py-3">
                            <span className="text-sm font-semibold text-primary">
                              #{order._id.slice(-8).toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slateText">
                            {customer?.username || 'Guest'}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-slateText">
                            {formatCurrency(order.total)}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={order.paymentStatus} />
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={order.orderStatus} />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
