'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuthStore } from '@/store/adminAuthStore';

export default function DashboardLoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = adminAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await login(email, password);
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white font-heading">
            Electro<span className="text-accent">Cart</span>
          </h1>
          <p className="text-white/50 text-sm mt-2">Admin Dashboard Login</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Sign In</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mcjosephmoyo7@gmail.com"
                className="w-full bg-white/10 text-white rounded-lg px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent border border-white/10"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-white/10 text-white rounded-lg px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent border border-white/10"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent-dark text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <p className="text-white/40 text-xs mb-2">Owner Credentials:</p>
            <p className="text-white/60 text-xs font-mono break-all">
              mcjosephmoyo7@gmail.com<br />MCJOSEPHMOYO12345
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
