export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function discountPercent(price: number, discountPrice?: number): number | null {
  if (discountPrice == null || discountPrice >= price) return null;
  return Math.round(((price - discountPrice) / price) * 100);
}

export function daysAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

export function generateOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const block = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `SC-${block(4)}-${block(4)}-${block(4)}`;
}

export function combineQueryValue(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? '';
  return v ?? '';
}