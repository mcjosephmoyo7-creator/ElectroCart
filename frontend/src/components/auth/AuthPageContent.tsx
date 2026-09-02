'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiAlertTriangle } from 'react-icons/fi';
import type { AuthMode } from '@/store/authUiStore';
import AuthForm from '@/components/auth/AuthForm';

interface AuthPageContentProps {
  initialMode: Exclude<AuthMode, 'forgot'>;
  title: string;
  subtitle: string;
  redirect: string;
  error?: string;
}

export default function AuthPageContent({ initialMode, title, subtitle, redirect, error }: AuthPageContentProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const heading =
  mode === 'register'
  ? 'Create Your Account'
  : mode === 'forgot'
  ? 'Reset Your Password'
  : title;
  const subheading =
  mode === 'register'
  ? 'Join ElectroCart and start shopping smart.'
  : mode === 'forgot'
  ? 'Enter your email and we will send you a reset link.'
  : subtitle;

  return (
  <div className="container-custom py-12 lg:py-16">
  <div className="max-w-md mx-auto bg-white  border border-lineBorder  rounded-2xl p-6 lg:p-8 shadow-card">
  <div className="text-center mb-6">
  <h1 className="text-2xl font-bold text-slateText ">{heading}</h1>
  <p className="text-muted text-sm mt-1">{subheading}</p>
  </div>

  {error && (
  <div className="mb-4 flex items-start gap-2.5 rounded-lg bg-error/10 text-error text-sm px-3 py-2.5">
  <FiAlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
  <span>
  {error === 'google_oauth_not_configured' || error === 'facebook_oauth_not_configured'
  ? 'Social sign-in is not configured yet. Please use email to sign in.'
  : 'Something went wrong while signing you in. Please try again.'}
  </span>
  </div>
  )}

  <AuthForm
  mode={mode}
  onModeChange={setMode}
  redirectPath={redirect}
  onAuthenticated={() => router.push(redirect)}
  />
  </div>
  </div>
  );
}