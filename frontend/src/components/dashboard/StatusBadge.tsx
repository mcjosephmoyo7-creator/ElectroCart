'use client';

import { getStatusColor } from '@/lib/dashboardUtils';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full capitalize ${getStatusColor(status)} ${sizeClasses}`}
    >
      {status}
    </span>
  );
}
