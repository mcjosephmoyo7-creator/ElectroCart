'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { orderApi } from '@/lib/api';
import { formatCurrency, formatDateTime } from '@/lib/dashboardUtils';
import type { DashboardOrder } from '@/types/dashboard';
import {
  HiOutlineArrowLeft,
  HiOutlineLocationMarker,
  HiOutlineUser,
  HiOutlineXCircle,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import StatusBadge from '@/components/dashboard/StatusBadge';
import OrderTrackingTracker from '@/components/dashboard/OrderTrackingTracker';

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<DashboardOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getById(params.id);
      setOrder(res.data.data);
    } catch {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const updateStatus = async (status: string) => {
    if (!order) return;
    setSaving(true);
    try {
      await orderApi.updateStatus(order._id, status);
      toast.success('Order status updated');
      fetchOrder();
    } catch {
      toast.error('Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  const updatePayment = async (paymentStatus: string) => {
    if (!order) return;
    setSaving(true);
    try {
      await orderApi.updatePayment(order._id, paymentStatus);
      toast.success('Payment status updated');
      fetchOrder();
    } catch {
      toast.error('Failed to update payment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-muted text-sm">Order not found.</p>
        <Link href="/dashboard/orders" className="text-primary text-sm mt-2 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  const customer =
    typeof order.user === 'object' && order.user ? order.user : null;
  const isCancelled = order.orderStatus === 'cancelled';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-2 text-sm font-medium text-muted hover:text-primary transition-colors"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.orderStatus} size="md" />
          <StatusBadge status={order.paymentStatus} size="md" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slateText font-heading">
          Order #{order._id.slice(-8).toUpperCase()}
        </h2>
        <p className="text-sm text-muted mt-0.5">
          Placed on {formatDateTime(order.createdAt)}
        </p>
      </div>

      {isCancelled ? (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
          <HiOutlineXCircle className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium text-red-700">
            This order was cancelled
          </span>
        </div>
      ) : (
        <OrderTrackingTracker order={order} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-lineBorder rounded-xl p-5">
            <h3 className="text-base font-bold text-slateText mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 py-3 border-b border-lineBorder last:border-0"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-body flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-lineBorder flex items-center justify-center text-xs text-muted">
                        N/A
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slateText truncate">{item.name}</p>
                    <p className="text-xs text-muted">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slateText">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <p className="text-xs text-muted">{formatCurrency(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-lineBorder rounded-xl p-5">
            <h3 className="text-base font-bold text-slateText mb-4">Shipping Address</h3>
            <div className="flex items-start gap-3">
              <HiOutlineLocationMarker className="w-5 h-5 text-muted mt-0.5" />
              <div className="text-sm text-slateText">
                <p className="font-medium">
                  {[order.shippingAddress.street, order.shippingAddress.address]
                    .filter(Boolean)
                    .join(', ') || 'No street provided'}
                </p>
                <p className="text-muted mt-0.5">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zip || order.shippingAddress.postalCode}
                </p>
                <p className="text-muted">{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary & actions */}
        <div className="space-y-6">
          <div className="bg-white border border-lineBorder rounded-xl p-5">
            <h3 className="text-base font-bold text-slateText mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium text-slateText">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span className="font-medium text-slateText">
                  {order.shippingCost === 0 ? 'Free' : formatCurrency(order.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Tax</span>
                <span className="font-medium text-slateText">{formatCurrency(order.tax)}</span>
              </div>
              <div className="border-t border-lineBorder pt-2 mt-2 flex justify-between">
                <span className="font-bold text-slateText">Total</span>
                <span className="font-bold text-slateText">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-lineBorder rounded-xl p-5">
            <h3 className="text-base font-bold text-slateText mb-4">Customer</h3>
            {customer ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <HiOutlineUser className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slateText">{customer.username}</p>
                  <p className="text-xs text-muted">{customer.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">Guest order</p>
            )}
          </div>

          {!isCancelled && (
            <div className="bg-white border border-lineBorder rounded-xl p-5">
              <h3 className="text-base font-bold text-slateText mb-4">Update Status</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">
                    Order Status
                  </label>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(e.target.value)}
                    disabled={saving}
                    className="w-full bg-white rounded-lg px-3 py-2 text-sm border border-lineBorder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">
                    Payment Status
                  </label>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => updatePayment(e.target.value)}
                    disabled={saving}
                    className="w-full bg-white rounded-lg px-3 py-2 text-sm border border-lineBorder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {saving && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted">
              <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              Saving...
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => router.push('/dashboard/orders')}
          className="px-4 py-2 text-sm font-medium text-slateText bg-white border border-lineBorder rounded-lg hover:bg-body transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}
