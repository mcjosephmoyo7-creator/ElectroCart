'use client';

import { formatCurrency } from '@/lib/dashboardUtils';
import type { DashboardOrder } from '@/types/dashboard';
import {
  HiOutlineShoppingBag,
  HiOutlineClipboardCheck,
  HiOutlineTruck,
  HiOutlineMap,
  HiOutlineLocationMarker,
  HiOutlineXCircle,
  HiOutlineClock,
} from 'react-icons/hi';
import { FaBox, FaShippingFast, FaHome } from 'react-icons/fa';

interface OrderTrackingTrackerProps {
  order: DashboardOrder;
}

// Builds a shipping journey with legs/stops for a visually-rich tracker.
export default function OrderTrackingTracker({ order }: OrderTrackingTrackerProps) {
  const status = order.orderStatus;

  if (status === 'cancelled') {
    return (
      <div className="bg-white border border-lineBorder rounded-xl p-5">
        <div className="flex items-center gap-3 text-red-600">
          <HiOutlineXCircle className="w-6 h-6" />
          <div>
            <p className="font-semibold">Order cancelled</p>
            <p className="text-sm text-muted">No shipment in transit for this order.</p>
          </div>
        </div>
      </div>
    );
  }

  const stages = [
    { key: 'placed', label: 'Order Placed', icon: HiOutlineShoppingBag },
    { key: 'processing', label: 'Processing', icon: HiOutlineClipboardCheck },
    { key: 'shipped', label: 'Shipped', icon: HiOutlineTruck },
    { key: 'in_transit', label: 'In Transit', icon: HiOutlineMap },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: FaShippingFast },
    { key: 'delivered', label: 'Delivered', icon: FaHome },
  ];

  // Map backend status to our journey stage
  const statusIndexMap: Record<string, number> = {
    pending: 0,
    processing: 1,
    shipped: 2,
    delivered: 5,
  };
  const currentStageIndex = statusIndexMap[status] ?? 0;

  // "Delivered" jumps to the end; for shipped we show in-transit as active progress
  const progressPercent =
    status === 'delivered'
      ? 100
      : status === 'shipped'
      ? 75
      : (currentStageIndex / 5) * 100;

  const shippedAmount = order.items?.reduce(
    (sum, item) => sum + item.quantity,
    0
  ) ?? 0;

  return (
    <div className="bg-white border border-lineBorder rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slateText">
            Tracking your order
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-primary">
            {status === 'delivered'
              ? 'Delivered'
              : status === 'shipped'
              ? 'On the way'
              : 'Preparing'}
          </p>
          {status !== 'delivered' && (
            <p className="text-xs text-muted flex items-center gap-1 justify-end">
              <HiOutlineClock className="w-3 h-3" /> ETA 3-5 business days
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-lineBorder rounded-full overflow-hidden mb-6">
        <div
          className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Journey stops */}
      <div className="relative">
        {/* connecting line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-lineBorder" />
        <div className="space-y-5">
          {stages.map((stage, idx) => {
            const reached = idx <= currentStageIndex || (status === 'shipped' && idx <= 3);
            const isDelivered = stage.key === 'delivered';
            const active = idx === currentStageIndex && status !== 'delivered';
            const Icon = stage.icon;
            return (
              <div key={stage.key} className="relative flex items-start gap-4 pl-0">
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    reached
                      ? isDelivered
                        ? 'bg-success text-white'
                        : 'bg-primary text-white'
                      : 'bg-body text-muted border-2 border-lineBorder'
                  } ${active ? 'ring-4 ring-primary/20' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="pt-1">
                  <p
                    className={`text-sm font-semibold ${
                      reached ? 'text-slateText' : 'text-muted'
                    }`}
                  >
                    {stage.label}
                  </p>
                  {idx === 0 && (
                    <p className="text-xs text-muted">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                  {isDelivered && (
                    <p className="text-xs text-success font-medium">
                      {order.deliveredAt
                        ? new Date(order.deliveredAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Soon'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shipment summary */}
      <div className="mt-6 pt-4 border-t border-lineBorder flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted">
          <FaBox className="w-4 h-4 text-primary" />
          <span>
            {shippedAmount} {shippedAmount === 1 ? 'item' : 'items'} ·{' '}
            {formatCurrency(order.total)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted ml-auto">
          <HiOutlineLocationMarker className="w-4 h-4 text-accent" />
          <span>
            {order.shippingAddress.city}, {order.shippingAddress.country}
          </span>
        </div>
      </div>
    </div>
  );
}
