'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/auth/AuthModal';
import { authStore } from '@/store/authStore';

const hideLayoutRoutes: string[] = ['/dashboard'];

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = hideLayoutRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    authStore.getState().initialize();
  }, []);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <AuthModal />
    </div>
  );
}
