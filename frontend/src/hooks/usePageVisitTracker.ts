'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const SESSION_KEY = 'shopcart-session-id';

function getSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `sess-${Date.now()}`;
  }
}

async function recordVisit(page: string) {
  try {
    await fetch('/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: getSessionId(), page }),
    });
  } catch {
    // silent - tracking is best-effort
  }
}

// Records a visit once per page navigation (deduplicated per path within a session).
export function usePageVisitTracker() {
  const pathname = usePathname();
  const seen = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (pathname.startsWith('/dashboard')) return;

    // Dedupe repeated visits to the same path within the same session/tab
    if (seen.current.has(pathname)) return;
    seen.current.add(pathname);

    // Small delay so we don't block initial render
    const t = setTimeout(() => recordVisit(pathname), 500);
    return () => clearTimeout(t);
  }, [pathname]);
}
