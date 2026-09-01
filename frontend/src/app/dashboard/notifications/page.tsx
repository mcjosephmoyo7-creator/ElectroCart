'use client';

import { useEffect, useState, useCallback } from 'react';
import { orderApi, productApi, dashboardApi } from '@/lib/api';
import type { DashboardOrder, DashboardProduct } from '@/types/dashboard';
import { formatDateTime } from '@/lib/dashboardUtils';
import {
  HiOutlineBell,
  HiOutlineShoppingBag,
  HiOutlineExclamation,
  HiOutlineUserAdd,
  HiOutlineArrowLeft,
  HiOutlineCreditCard,
  HiOutlineCheckCircle,
  HiOutlineStar,
  HiOutlineSpeakerphone,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  color: string;
}

const typeConfig: Record<string, { icon: typeof HiOutlineBell; color: string }> = {
  newOrder: { icon: HiOutlineShoppingBag, color: 'bg-blue-50 text-blue-600' },
  lowStock: { icon: HiOutlineExclamation, color: 'bg-amber-50 text-amber-600' },
  newCustomer: { icon: HiOutlineUserAdd, color: 'bg-emerald-50 text-emerald-600' },
  return: { icon: HiOutlineArrowLeft, color: 'bg-red-50 text-red-600' },
  payment: { icon: HiOutlineCreditCard, color: 'bg-purple-50 text-purple-600' },
  review: { icon: HiOutlineStar, color: 'bg-star/10 text-star' },
  delivered: { icon: HiOutlineCheckCircle, color: 'bg-emerald-50 text-emerald-600' },
  campaign: { icon: HiOutlineSpeakerphone, color: 'bg-orange-50 text-orange-600' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const buildNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes, statsRes] = await Promise.allSettled([
        orderApi.getAll({ limit: '20' }),
        productApi.getAll({ limit: '100' }),
        dashboardApi.getStats(),
      ]);

      const items: NotificationItem[] = [];

      if (ordersRes.status === 'fulfilled') {
        const orders = ordersRes.value.data.data.orders || [];
        orders.forEach((order: DashboardOrder) => {
          const customer =
            typeof order.user === 'object' && order.user ? order.user.username : 'a customer';
          items.push({
            id: `order-${order._id}`,
            type: 'newOrder',
            title: 'New order placed',
            message: `Order #${order._id.slice(-8).toUpperCase()} from ${customer}`,
            time: order.createdAt,
            read: false,
            color: typeConfig.newOrder.color,
          });
          if (order.orderStatus === 'delivered') {
            items.push({
              id: `delivered-${order._id}`,
              type: 'delivered',
              title: 'Order delivered',
              message: `Order #${order._id.slice(-8).toUpperCase()} was delivered`,
              time: order.updatedAt,
              read: false,
              color: typeConfig.delivered.color,
            });
          }
        });
      }

      if (productsRes.status === 'fulfilled') {
        const products = productsRes.value.data.data.products || [];
        products
          .filter((p: DashboardProduct) => p.stock < 10)
          .forEach((p: DashboardProduct) => {
            items.push({
              id: `stock-${p._id}`,
              type: 'lowStock',
              title: 'Low stock alert',
              message: `"${p.name}" only has ${p.stock} units left`,
              time: p.updatedAt,
              read: false,
              color: typeConfig.lowStock.color,
            });
          });
      }

      items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setNotifications(items);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    buildNotifications();
  }, [buildNotifications]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slateText font-heading">Notifications</h2>
          <p className="text-sm text-muted mt-0.5">
            {unreadCount} unread / {notifications.length} total
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
        >
          Mark all as read
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white border border-lineBorder rounded-xl py-16 text-center">
          <HiOutlineBell className="w-10 h-10 text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-muted">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const config = typeConfig[notification.type] || typeConfig.newOrder;
            const Icon = config.icon;
            return (
              <div
                key={notification.id}
                onClick={() => markRead(notification.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer hover:bg-body/50 ${
                  notification.read
                    ? 'bg-white border-lineBorder'
                    : 'bg-primary-50/50 border-primary/20'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm font-semibold ${notification.read ? 'text-slateText' : 'text-slateText'}`}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted mt-0.5">{notification.message}</p>
                  <p className="text-xs text-muted/70 mt-1">
                    {formatDateTime(notification.time)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
