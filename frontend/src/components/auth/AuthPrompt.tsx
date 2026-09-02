'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { FiLock } from 'react-icons/fi';
import { BsShieldCheck, BsTruck, BsHeart } from 'react-icons/bs';
import type { AuthMode } from '@/store/authUiStore';
import AuthForm from '@/components/auth/AuthForm';

export type AuthBenefit = 'wishlist' | 'orders' | 'secure';

interface AuthPromptProps {
  title: string;
  subtitle: string;
  benefits?: AuthBenefit[];
}

const benefitMeta = {
  wishlist: { Icon: BsHeart, label: 'Save items to your wishlist and find them anytime' },
  orders: { Icon: BsTruck, label: 'Track your orders and reorder in one click' },
  secure: { Icon: BsShieldCheck, label: 'Secure account with encrypted credentials' },
};

export default function AuthPrompt({ title, subtitle, benefits = ['wishlist', 'orders', 'secure'] }: AuthPromptProps) {
  const pathname = usePathname();
  const [mode, setMode] = useState<AuthMode>('signin');

  return (
  <div className="max-w-md mx-auto bg-white  border border-lineBorder  rounded-2xl p-8 shadow-card">
  <div className="mb-6 text-center">
  <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 text-primary  flex items-center justify-center mb-4">
  <FiLock className="w-6 h-6" />
  </div>
  <h1 className="text-xl font-bold text-slateText ">{title}</h1>
  <p className="text-muted text-sm mt-1">{subtitle}</p>
  </div>

  <AuthForm mode={mode} onModeChange={setMode} redirectPath={pathname || '/'} onAuthenticated={() => undefined} />

  <div className="mt-6 pt-5 border-t border-lineBorder  space-y-2.5">
  {benefits.map((b) => {
  const { Icon, label } = benefitMeta[b];
  return (
  <div key={b} className="flex items-start gap-2.5 text-sm text-muted">
  <Icon className="w-4 h-4 mt-0.5 shrink-0 text-primary " />
  <span>{label}</span>
  </div>
  );
  })}
  </div>
  </div>
  );
}