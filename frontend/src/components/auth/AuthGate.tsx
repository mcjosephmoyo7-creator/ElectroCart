'use client';

import { authStore } from '@/store/authStore';
import AuthPrompt, { AuthBenefit } from '@/components/auth/AuthPrompt';

interface AuthGateProps {
  title: string;
  subtitle: string;
  benefits?: AuthBenefit[];
  children: React.ReactNode;
}

export default function AuthGate({ title, subtitle, benefits, children }: AuthGateProps) {
  const status = authStore((s) => s.status);

  if (status === 'loading') {
    return (
      <div className="container-custom py-24 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <div className="container-custom py-8 lg:py-12">
        <AuthPrompt title={title} subtitle={subtitle} benefits={benefits} />
      </div>
    );
  }

  return <>{children}</>;
}