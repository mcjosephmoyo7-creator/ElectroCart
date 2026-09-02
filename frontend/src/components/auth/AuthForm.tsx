'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';
import { authStore } from '@/store/authStore';
import { authApi, oauthUrls } from '@/lib/api';
import type { AuthMode } from '@/store/authUiStore';

interface AuthFormProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  redirectPath: string;
  onAuthenticated: () => void;
}

const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function AuthForm({ mode, onModeChange, redirectPath, onAuthenticated }: AuthFormProps) {
  const login = authStore((s) => s.login);
  const register = authStore((s) => s.register);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isRegister = mode === 'register';
  const isForgot = mode === 'forgot';

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (isForgot) {
  if (!validEmail(email)) return toast.error('Enter a valid email address');
  setLoading(true);
  try {
  await authApi.forgotPassword(email);
  toast.success('Password reset link sent to your email');
  onModeChange('signin');
  } catch (err) {
  setError(err instanceof Error ? err.message : 'Something went wrong');
  } finally {
  setLoading(false);
  }
  return;
  }

  if (!validEmail(email)) return toast.error('Enter a valid email address');
  if (isRegister) {
  if (username.trim().length < 2) return toast.error('Username must be at least 2 characters');
  if (password.length < 6) return toast.error('Password must be at least 6 characters');
  } else if (password.length < 6) {
  return toast.error('Password must be at least 6 characters');
  }

  setLoading(true);
  try {
  if (isRegister) {
  await register(username.trim(), email, password);
  toast.success('Account created! Welcome to ElectroCart');
  } else {
  await login(email, password);
  toast.success('Welcome back!');
  }
  onAuthenticated();
  } catch (err) {
  setError(err instanceof Error ? err.message : 'Something went wrong');
  } finally {
  setLoading(false);
  }
  };

  return (
  <div>
  <div className="space-y-2.5">
  <a
  href={oauthUrls.google(redirectPath)}
  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-lineBorder  bg-white  text-slateText  text-sm font-semibold hover:bg-gray-50  transition-colors"
  >
  <FcGoogle className="w-5 h-5" />
  Continue with Google
  </a>
  <a
  href={oauthUrls.facebook(redirectPath)}
  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-lineBorder  bg-white  text-slateText  text-sm font-semibold hover:bg-gray-50  transition-colors"
  >
  <BsFacebook className="w-5 h-5 text-[#1877F2]" />
  Continue with Facebook
  </a>
  </div>

  <div className="flex items-center gap-3 my-5">
  <div className="flex-1 h-px bg-lineBorder " />
  <span className="text-xs text-muted font-medium">
  {mode === 'forgot' ? 'reset via email' : 'or sign in with email'}
  </span>
  <div className="flex-1 h-px bg-lineBorder " />
  </div>

  {error && (
  <div className="mb-4 rounded-lg bg-error/10 text-error text-sm px-3 py-2.5">{error}</div>
  )}

  <form onSubmit={handleSubmit} className="space-y-4">
  {isRegister && (
  <div>
  <label className="block text-sm font-semibold mb-1.5 text-slateText ">
  Username
  </label>
  <input
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  placeholder="Your username"
  className="input-field"
  autoComplete="username"
  />
  </div>
  )}

  <div>
  <label className="block text-sm font-semibold mb-1.5 text-slateText ">
  Email Address
  </label>
  <input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="you@example.com"
  className="input-field"
  autoComplete="email"
  />
  </div>

  {!isForgot && (
  <div>
  <label className="block text-sm font-semibold mb-1.5 text-slateText ">
  Password
  </label>
  <div className="relative">
  <input
  type={showPassword ? 'text' : 'password'}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="••••••••"
  className="input-field pr-16"
  autoComplete={isRegister ? 'new-password' : 'current-password'}
  />
  <button
  type="button"
  onClick={() => setShowPassword((s) => !s)}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary text-xs font-semibold"
  >
  {showPassword ? 'Hide' : 'Show'}
  </button>
  </div>
  </div>
  )}

  {mode === 'signin' && (
  <div className="text-right">
  <button
  type="button"
  onClick={() => onModeChange('forgot')}
  className="text-xs font-semibold text-primary hover:underline"
  >
  Forgot password?
  </button>
  </div>
  )}

  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-60">
  {loading
  ? 'Please wait…'
  : isForgot
  ? 'Send Reset Link'
  : isRegister
  ? 'Create Account'
  : 'Login'}
  </button>
  </form>

  <p className="text-center text-sm text-muted mt-5">
  {mode === 'register' ? (
  <>
  Already have an account?{' '}
  <button type="button" onClick={() => onModeChange('signin')} className="font-semibold text-primary hover:underline">
  Log in
  </button>
  </>
  ) : mode === 'forgot' ? (
  <>
  Remembered it?{' '}
  <button type="button" onClick={() => onModeChange('signin')} className="font-semibold text-primary hover:underline">
  Back to login
  </button>
  </>
  ) : (
  <>
  Don&apos;t have an account?{' '}
  <button type="button" onClick={() => onModeChange('register')} className="font-semibold text-primary hover:underline">
  Create one
  </button>
  </>
  )}
  </p>
  </div>
  );
}