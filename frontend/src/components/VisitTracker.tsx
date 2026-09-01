'use client';

import { usePageVisitTracker } from '@/hooks/usePageVisitTracker';

// Minimal client component that records page visits for analytics.
export default function VisitTracker() {
  usePageVisitTracker();
  return null;
}
