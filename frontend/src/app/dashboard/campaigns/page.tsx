'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/dashboardUtils';
import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineSpeakerphone,
  HiOutlineTag,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

interface Campaign {
  id: string;
  name: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  status: 'active' | 'scheduled' | 'ended';
  views: number;
  clicks: number;
  conversions: number;
  startDate: string;
  endDate: string;
}

const seedCampaigns: Campaign[] = [
  {
    id: 'c1',
    name: 'Summer Sale',
    code: 'SUMMER25',
    discountType: 'percent',
    discountValue: 25,
    status: 'active',
    views: 4820,
    clicks: 1240,
    conversions: 312,
    startDate: '2026-08-01',
    endDate: '2026-08-31',
  },
  {
    id: 'c2',
    name: 'New User Welcome',
    code: 'WELCOME10',
    discountType: 'percent',
    discountValue: 10,
    status: 'active',
    views: 2150,
    clicks: 890,
    conversions: 410,
    startDate: '2026-07-15',
    endDate: '2026-12-31',
  },
  {
    id: 'c3',
    name: 'Flash Weekend',
    code: 'FLASH50',
    discountType: 'fixed',
    discountValue: 50,
    status: 'scheduled',
    views: 0,
    clicks: 0,
    conversions: 0,
    startDate: '2026-09-05',
    endDate: '2026-09-07',
  },
];

const statusColors: Record<Campaign['status'], string> = {
  active: 'bg-emerald-100 text-emerald-700',
  scheduled: 'bg-amber-100 text-amber-700',
  ended: 'bg-gray-100 text-gray-600',
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(seedCampaigns);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    code: '',
    discountType: 'percent' as 'percent' | 'fixed',
    discountValue: '',
    status: 'active' as Campaign['status'],
    startDate: '',
    endDate: '',
  });

  const addCampaign = () => {
    if (!form.name.trim() || !form.code.trim() || !form.discountValue) {
      toast.error('Name, code and discount value are required');
      return;
    }
    const newCampaign: Campaign = {
      id: `c${Date.now()}`,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      status: form.status,
      views: 0,
      clicks: 0,
      conversions: 0,
      startDate: form.startDate,
      endDate: form.endDate,
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
    toast.success('Campaign created');
    setModalOpen(false);
    setForm({ name: '', code: '', discountType: 'percent', discountValue: '', status: 'active', startDate: '', endDate: '' });
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    toast.success('Campaign deleted');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slateText font-heading">Campaigns</h2>
          <p className="text-sm text-muted mt-0.5">
            {campaigns.filter((c) => c.status === 'active').length} active campaigns
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-lineBorder rounded-xl p-5">
          <p className="text-xs text-muted font-medium mb-1">Active</p>
          <p className="text-2xl font-bold text-slateText">
            {campaigns.filter((c) => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-white border border-lineBorder rounded-xl p-5">
          <p className="text-xs text-muted font-medium mb-1">Scheduled</p>
          <p className="text-2xl font-bold text-slateText">
            {campaigns.filter((c) => c.status === 'scheduled').length}
          </p>
        </div>
        <div className="bg-white border border-lineBorder rounded-xl p-5">
          <p className="text-xs text-muted font-medium mb-1">Total Conversions</p>
          <p className="text-2xl font-bold text-slateText">
            {campaigns.reduce((s, c) => s + c.conversions, 0)}
          </p>
        </div>
      </div>

      <div className="bg-white border border-lineBorder rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-body">
                {['Campaign', 'Code', 'Discount', 'Views', 'Clicks', 'Conversions', 'Status', 'Actions'].map(
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
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <HiOutlineSpeakerphone className="w-10 h-10 text-muted/30 mx-auto mb-3" />
                    <p className="text-sm text-muted">No campaigns yet</p>
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => {
                  const convRate =
                    campaign.clicks > 0
                      ? ((campaign.conversions / campaign.clicks) * 100).toFixed(1)
                      : '0.0';
                  return (
                    <tr key={campaign.id} className="hover:bg-body/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                            <HiOutlineTag className="w-4 h-4 text-accent" />
                          </div>
                          <span className="text-sm font-medium text-slateText">
                            {campaign.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono font-semibold text-primary">
                          {campaign.code}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slateText">
                        {campaign.discountType === 'percent'
                          ? `${campaign.discountValue}%`
                          : formatCurrency(campaign.discountValue)}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">
                        {campaign.views.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">
                        {campaign.clicks.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-slateText">{campaign.conversions}</p>
                          <p className="text-xs text-muted">{convRate}% rate</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${statusColors[campaign.status]}`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteCampaign(campaign.id)}
                          className="p-2 text-muted hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-slateText mb-4">New Campaign</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slateText mb-1.5">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Winter Sale"
                  className="w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-lineBorder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slateText mb-1.5">
                    Discount Code
                  </label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="WINTER25"
                    className="w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-lineBorder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slateText mb-1.5">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    placeholder="25"
                    className="w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-lineBorder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slateText mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(e) =>
                      setForm({ ...form, discountType: e.target.value as 'percent' | 'fixed' })
                    }
                    className="w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-lineBorder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slateText mb-1.5">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as Campaign['status'] })
                    }
                    className="w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-lineBorder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="active">Active</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slateText mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-lineBorder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slateText mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-lineBorder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slateText bg-body border border-lineBorder rounded-lg hover:bg-lineBorder/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addCampaign}
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
