'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/dashboardUtils';
import { orderApi } from '@/lib/api';
import type { DashboardOrder } from '@/types/dashboard';
import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencilAlt,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import OrderTrackingTracker from '@/components/dashboard/OrderTrackingTracker';

interface ShippingMethod {
  id: string;
  name: string;
  carrier: string;
  estimatedDays: string;
  cost: number;
  freeThreshold: number;
  isActive: boolean;
}

const seedMethods: ShippingMethod[] = [
  {
    id: 's1',
    name: 'Standard Shipping',
    carrier: 'ElectroCart Logistics',
    estimatedDays: '3-5 days',
    cost: 9.99,
    freeThreshold: 100,
    isActive: true,
  },
  {
    id: 's2',
    name: 'Express Shipping',
    carrier: 'DHL',
    estimatedDays: '1-2 days',
    cost: 24.99,
    freeThreshold: 0,
    isActive: true,
  },
  {
    id: 's3',
    name: 'Free Shipping',
    carrier: 'ElectroCart Logistics',
    estimatedDays: '5-8 days',
    cost: 0,
    freeThreshold: 0,
    isActive: true,
  },
];

const inputClass =
  'w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-lineBorder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';

export default function ShippingPage() {
  const [methods, setMethods] = useState<ShippingMethod[]>(seedMethods);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ShippingMethod | null>(null);
  const [form, setForm] = useState({
    name: '',
    carrier: '',
    estimatedDays: '',
    cost: '',
    freeThreshold: '',
    isActive: true,
  });
  const [trackingModal, setTrackingModal] = useState(false);
  const [trackingQuery, setTrackingQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<DashboardOrder | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const handleTrack = async () => {
    const id = trackingQuery.trim();
    if (!id) {
      toast.error('Enter an order ID or tracking number');
      return;
    }
    setTrackingLoading(true);
    try {
      const res = await orderApi.getById(id);
      setTrackedOrder(res.data.data);
    } catch {
      toast.error('No order found for that ID');
      setTrackedOrder(null);
    } finally {
      setTrackingLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', carrier: '', estimatedDays: '', cost: '', freeThreshold: '', isActive: true });
    setModalOpen(true);
  };

  const openEdit = (m: ShippingMethod) => {
    setEditing(m);
    setForm({
      name: m.name,
      carrier: m.carrier,
      estimatedDays: m.estimatedDays,
      cost: String(m.cost),
      freeThreshold: String(m.freeThreshold),
      isActive: m.isActive,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.carrier.trim()) {
      toast.error('Name and carrier are required');
      return;
    }
    if (editing) {
      setMethods((prev) =>
        prev.map((m) =>
          m.id === editing.id
            ? {
                ...m,
                name: form.name.trim(),
                carrier: form.carrier.trim(),
                estimatedDays: form.estimatedDays,
                cost: Number(form.cost) || 0,
                freeThreshold: Number(form.freeThreshold) || 0,
                isActive: form.isActive,
              }
            : m
        )
      );
      toast.success('Shipping method updated');
    } else {
      setMethods((prev) => [
        ...prev,
        {
          id: `s${Date.now()}`,
          name: form.name.trim(),
          carrier: form.carrier.trim(),
          estimatedDays: form.estimatedDays,
          cost: Number(form.cost) || 0,
          freeThreshold: Number(form.freeThreshold) || 0,
          isActive: form.isActive,
        },
      ]);
      toast.success('Shipping method added');
    }
    setModalOpen(false);
  };

  const toggleActive = (id: string) => {
    const target = methods.find((m) => m.id === id);
    if (!target) return;
    setMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    );
    toast.success(`${target.name} ${target.isActive ? 'deactivated' : 'activated'}`);
  };

  const deleteMethod = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
    toast.success('Shipping method deleted');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slateText font-heading">Shipping</h2>
          <p className="text-sm text-muted mt-0.5">
            {methods.filter((m) => m.isActive).length} active methods
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTrackingModal(true)}
            className="px-4 py-2.5 text-sm font-medium text-slateText bg-white border border-lineBorder rounded-lg hover:bg-body transition-colors"
          >
            Track Order
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Method
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {methods.map((method) => (
          <div
            key={method.id}
            className="bg-white border border-lineBorder rounded-xl p-5 hover:shadow-card transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <HiOutlineTruck className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(method)}
                  className="p-2 text-muted hover:text-primary transition-colors"
                >
                  <HiOutlinePencilAlt className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteMethod(method.id)}
                  className="p-2 text-muted hover:text-red-500 transition-colors"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-base font-bold text-slateText">{method.name}</h3>
            <p className="text-xs text-muted mt-0.5">{method.carrier}</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Delivery</span>
                <span className="font-medium text-slateText">{method.estimatedDays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Cost</span>
                <span className="font-semibold text-slateText">
                  {method.cost === 0 ? 'Free' : formatCurrency(method.cost)}
                </span>
              </div>
              {method.freeThreshold > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted">Free Over</span>
                  <span className="font-medium text-slateText">
                    {formatCurrency(method.freeThreshold)}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-lineBorder flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  method.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {method.isActive ? (
                  <HiOutlineCheckCircle className="w-3 h-3" />
                ) : (
                  <HiOutlineXCircle className="w-3 h-3" />
                )}
                {method.isActive ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={() => toggleActive(method.id)}
                className="text-xs font-medium text-primary hover:text-primary-dark"
              >
                {method.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slateText mb-4">
              {editing ? 'Edit Shipping Method' : 'Add Shipping Method'}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slateText mb-1.5">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Standard Shipping"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slateText mb-1.5">Carrier</label>
                  <input
                    type="text"
                    value={form.carrier}
                    onChange={(e) => setForm({ ...form, carrier: e.target.value })}
                    placeholder="DHL"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slateText mb-1.5">
                  Estimated Delivery
                </label>
                <input
                  type="text"
                  value={form.estimatedDays}
                  onChange={(e) => setForm({ ...form, estimatedDays: e.target.value })}
                  placeholder="3-5 days"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slateText mb-1.5">Cost ($)</label>
                  <input
                    type="number"
                    value={form.cost}
                    onChange={(e) => setForm({ ...form, cost: e.target.value })}
                    placeholder="9.99"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slateText mb-1.5">
                    Free Shipping Over
                  </label>
                  <input
                    type="number"
                    value={form.freeThreshold}
                    onChange={(e) => setForm({ ...form, freeThreshold: e.target.value })}
                    placeholder="100"
                    className={inputClass}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-5 h-5 accent-primary"
                />
                <span className="text-sm text-slateText">Active</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slateText bg-body border border-lineBorder rounded-lg hover:bg-lineBorder/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
                >
                  {editing ? 'Save' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {trackingModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-slateText mb-4">Track Order</h3>
            <p className="text-sm text-muted mb-4">
              Enter an order ID to look up the order's shipping journey.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={trackingQuery}
                onChange={(e) => setTrackingQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                placeholder="Order ID"
                className={inputClass}
              />
              <button
                onClick={handleTrack}
                disabled={trackingLoading}
                className="flex-shrink-0 px-4 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-60"
              >
                {trackingLoading ? 'Searching…' : 'Track'}
              </button>
            </div>

            {trackedOrder && (
              <div className="mt-5 max-h-80 overflow-y-auto">
                <OrderTrackingTracker order={trackedOrder} />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-5">
              <button
                onClick={() => {
                  setTrackingModal(false);
                  setTrackedOrder(null);
                  setTrackingQuery('');
                }}
                className="px-4 py-2 text-sm font-medium text-slateText bg-body border border-lineBorder rounded-lg hover:bg-lineBorder/50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
