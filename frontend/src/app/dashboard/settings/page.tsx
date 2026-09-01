'use client';

import { useState, useEffect } from 'react';
import { adminAuthStore } from '@/store/adminAuthStore';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = adminAuthStore();
  const [storeName, setStoreName] = useState('My Store');
  const [storeEmail, setStoreEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState('10');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setUsername((prev) => prev || user?.username || '');
    setStoreEmail((prev) => prev || user?.email || '');
  }, [user]);

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Store settings saved');
    }, 500);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await authApi.changePassword(currentPassword, newPassword);
      toast.success('Password updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast.error('Failed to update password');
    }
  };

  const inputClass =
    'w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-lineBorder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';
  const labelClass = 'block text-sm font-medium text-slateText mb-1.5';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slateText font-heading">Settings</h2>
        <p className="text-sm text-muted mt-0.5">Manage your store and account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store settings */}
        <form onSubmit={handleSaveStore} className="bg-white border border-lineBorder rounded-xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slateText">Store Settings</h3>
          <div>
            <label className={labelClass}>Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Store Email</label>
            <input
              type="email"
              value={storeEmail}
              onChange={(e) => setStoreEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={inputClass}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Tax Rate (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Low Stock Alert Threshold</label>
            <input
              type="number"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>

        {/* Account settings */}
        <form onSubmit={handleChangePassword} className="bg-white border border-lineBorder rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slateText">Account &amp; Security</h3>
              <p className="text-xs text-muted">{user?.email}</p>
            </div>
          </div>
          <div>
            <label className={labelClass}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="border-t border-lineBorder pt-4">
            <p className="text-sm font-medium text-slateText mb-3">Change Password</p>
            <div className="space-y-3">
              <div>
                <label className={labelClass}>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className={labelClass}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className={labelClass}>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
