export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return num.toLocaleString();
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    paid: 'bg-emerald-100 text-emerald-700',
    refunded: 'bg-orange-100 text-orange-700',
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getPerformanceLabel(avgRating: number): string {
  if (avgRating >= 4.5) return 'Excellent';
  if (avgRating >= 4.0) return 'Good';
  if (avgRating >= 3.5) return 'Very Good';
  if (avgRating >= 2.5) return 'Average';
  return 'Bad';
}

export function getPerformanceColor(label: string): string {
  const colors: Record<string, string> = {
    Excellent: 'text-emerald-500',
    Good: 'text-blue-500',
    'Very Good': 'text-purple-500',
    Average: 'text-amber-500',
    Bad: 'text-red-500',
  };
  return colors[label] || 'text-gray-500';
}

export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + '...' : str;
}
