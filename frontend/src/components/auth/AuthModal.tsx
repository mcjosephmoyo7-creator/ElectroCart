'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import { authUiStore, AuthMode } from '@/store/authUiStore';
import { wishlistStore } from '@/store/wishlistStore';
import AuthForm from '@/components/auth/AuthForm';

export default function AuthModal() {
  const router = useRouter();
  const pathname = usePathname();
  const open = authUiStore((s) => s.open);
  const mode = authUiStore((s) => s.mode);
  const intent = authUiStore((s) => s.intent);
  const close = authUiStore((s) => s.close);
  const setMode = authUiStore((s) => s.setMode);

  useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close();
  };
  if (open) {
  document.body.style.overflow = 'hidden';
  window.addEventListener('keydown', onKey);
  }
  return () => {
  document.body.style.overflow = '';
  window.removeEventListener('keydown', onKey);
  };
  }, [open, close]);

  const handleAuthenticated = () => {
  if (intent?.type === 'navigate') {
  const path = intent.path;
  authUiStore.getState().clearIntent();
  authUiStore.getState().close();
  router.push(path);
  } else if (intent?.type === 'toggleWishlist' && intent.product) {
  wishlistStore.getState().toggleItem(intent.product);
  toast.success('Added to wishlist');
  authUiStore.getState().clearIntent();
  authUiStore.getState().close();
  } else {
  authUiStore.getState().close();
  }
  };

  const onAuthRoute =
  pathname === '/auth/login' || pathname === '/auth/register';
  const redirectPath =
  intent?.type === 'navigate' ? intent.path : onAuthRoute ? '/' : pathname || '/';

  return (
  <AnimatePresence>
  {open && (
  <motion.div
  className="fixed inset-0 z-[90] flex items-center justify-center p-4"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  >
  <div
  className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm"
  onClick={close}
  aria-hidden
  />
  <motion.div
  initial={{ opacity: 0, scale: 0.96, y: 12 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.96, y: 12 }}
  transition={{ duration: 0.18 }}
  className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white  border border-lineBorder  rounded-2xl p-6 shadow-card"
  >
  <button
  type="button"
  onClick={close}
  className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-muted hover:bg-gray-100  hover:text-slateText transition-colors"
  aria-label="Close"
  >
  <FiX className="w-5 h-5" />
  </button>

  <Panel mode={mode} setMode={setMode} redirectPath={redirectPath} onAuthenticated={handleAuthenticated} />
  </motion.div>
  </motion.div>
  )}
  </AnimatePresence>
  );
}

function Panel({
  mode,
  setMode,
  redirectPath,
  onAuthenticated,
}: {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  redirectPath: string;
  onAuthenticated: () => void;
}) {
  const title =
  mode === 'register' ? 'Create Your Account' : mode === 'forgot' ? 'Reset Your Password' : 'Welcome Back';
  const subtitle =
  mode === 'register'
  ? 'Join ElectroCart to manage your wishlist, orders and checkout securely.'
  : mode === 'forgot'
  ? 'Enter your email and we will send you a reset link.'
  : 'Log in to continue with your secure account.';

  return (
  <div>
  <div className="text-center mb-6 pr-8">
  <h2 className="text-xl font-bold text-slateText ">{title}</h2>
  <p className="text-muted text-sm mt-1">{subtitle}</p>
  </div>
  <AuthForm mode={mode} onModeChange={setMode} redirectPath={redirectPath} onAuthenticated={onAuthenticated} />
  </div>
  );
}